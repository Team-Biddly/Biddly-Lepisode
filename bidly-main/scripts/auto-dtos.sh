#!/bin/bash

# 모델 이름을 snake_case로 변환
to_snake_case() {
    echo "$1" | sed 's/\([A-Z]\)/_\L\1/g' | sed 's/^_//'
}

# .prisma 파일을 찾고 모듈 경로 설정
find_prisma_file() {
    local model_name_snake_case=$1
    local prisma_file

    # snake_case 모델 이름을 기반으로 .prisma 파일 찾기
    prisma_file=$(find . -type f -name "${model_name_snake_case}.prisma" | head -n 1)

    # .prisma 파일이 발견되었는지 확인
    if [[ -z "$prisma_file" ]]; then
        echo "오류: 모델 '${model_name_snake_case}'에 대한 .prisma 파일을 찾을 수 없습니다."
        exit 1
    else
        # .prisma 파일이 포함된 디렉터리 경로 추출
        module_path=$(dirname "$prisma_file")
    fi
}

# 모델 내용에서 필드를 파싱하는 함수
parse_model_fields() {
    local model_content="$1"
    local exclude_defaults="$2"
    local exclude_optional="$3"
    fields=()

    # 모델 내용의 각 줄을 순회
    while read -r line; do
        # 필드 줄을 매칭하고 이름, 타입, 옵션 캡처
        if [[ $line =~ ^[[:space:]]*([a-zA-Z0-9_]+)\??[[:space:]]+([a-zA-Z]+)[[:space:]]*(.*) ]]; then
            field_name="${BASH_REMATCH[1]}"
            field_type="${BASH_REMATCH[2]}"
            field_options="${BASH_REMATCH[3]}"

            # 필드가 선택 사항인지 확인 (이름 끝에 ?가 있는 경우)
            is_optional=$(echo "$line" | grep -q '?' && echo "true" || echo "false")

            # exclude_defaults가 설정된 경우 @default가 있는 필드는 제외
            if [[ "$exclude_defaults" == "true" && "$field_options" =~ @default ]]; then
                continue
            fi

            # exclude_optional이 설정된 경우 선택 사항 필드를 제외
            if [[ "$exclude_optional" == "true" && "$is_optional" == "true" ]]; then
                continue
            fi

            # Prisma 타입을 TypeScript 타입으로 매핑
            case $field_type in
                String)
                    fields+=("$field_name: string")
                    ;;
                DateTime)
                    fields+=("$field_name: Date")
                    ;;
                Int)
                    fields+=("$field_name: number")
                    ;;
                Float)
                    fields+=("$field_name: number")
                    ;;
                Boolean)
                    fields+=("$field_name: boolean")
                    ;;
                *)
                    fields+=("$field_name: any")
                    ;;
            esac
        fi
    done <<< "$model_content"
}

# DTO 파일을 생성하는 함수
generate_dto_files() {
    local model_name=$1
    local model_name_snake_case
    model_name_snake_case=$(to_snake_case "$model_name")

    # .prisma 파일을 찾아 모듈 경로 설정
    find_prisma_file "$model_name_snake_case"

    # 모델 필드만 추출
    model_content=$(awk "/model $model_name {/,/}/" "$module_path/${model_name_snake_case}.prisma" | sed '/model /d' | sed '/^{/d' | sed '/^}/d')

    if [[ -z "$model_content" ]]; then
        echo "오류: 모델 $model_name을(를) $module_path/${model_name_snake_case}.prisma에서 찾을 수 없습니다."
        exit 1
    fi

    # 모듈 경로 내에 dtos 디렉터리 생성
    dto_dir="${module_path}/dtos"
    mkdir -p "$dto_dir"

    # 기본 DTO 파일 생성 (예: user.dto.ts)
    parse_model_fields "$model_content" "false" "false"
    dto_content="export class ${model_name}DTO {\n"
    for field in "${fields[@]}"; do
        dto_content+="    $field;\n"
    done
    dto_content+="}\n"
    echo -e "$dto_content" > "${dto_dir}/${model_name_snake_case}.dto.ts"

    # 생성 DTO 파일 생성 (예: create-user.dto.ts), @default 및 선택 사항 필드를 제외
    parse_model_fields "$model_content" "true" "true"
    create_dto_content="export class Create${model_name}DTO {\n"
    for field in "${fields[@]}"; do
        create_dto_content+="    $field;\n"
    done
    create_dto_content+="}\n"
    echo -e "$create_dto_content" > "${dto_dir}/create-${model_name_snake_case}.dto.ts"

    # 업데이트 DTO 파일 생성 (예: update-user.dto.ts)
    update_dto_content="import { Create${model_name}DTO } from \"./create-${model_name_snake_case}.dto\";\n\n"
    update_dto_content+="export class Update${model_name}DTO implements Partial<Create${model_name}DTO> {}\n"
    echo -e "$update_dto_content" > "${dto_dir}/update-${model_name_snake_case}.dto.ts"

    echo "DTO 파일이 ${dto_dir}/에 생성되었습니다."
}

# 메인 실행
if [[ $# -lt 1 ]]; then
    echo "사용법: $0 <model-name>"
    exit 1
fi

generate_dto_files "$1"
