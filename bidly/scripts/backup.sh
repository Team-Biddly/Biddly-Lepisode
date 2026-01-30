#!/bin/bash

# 이 스크립트는 PostgreSQL 데이터베이스 백업을 자동화하고, 
# NHN Cloud Object Storage 또는 AWS S3 에 백업 파일을 업로드합니다.
# 크론탭에 등록하여 주기적으로 실행하세요.

# 백업 파일 최대 저장 개수 설정
MAX_BACKUPS=3

# 스토리지 타입 선택 NHN | AWS
STORAGE_TYPE="NHN"

# PostgreSQL 정보
PG_VERSION="17"
DB_HOST="111.222.333.444"
DB_USER="username"
DB_PASSWORD="1234"
DB_NAME="dbname"
USER_HOME=$(eval echo ~${SUDO_USER:-$USER})
BACKUP_DIR="${USER_HOME}/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DUMP_FILE="${BACKUP_DIR}/${DB_NAME}_${DATE}.dump"

# NHN Cloud Object Storage 정보
NHN_STORAGE_URL="https://kr1-api-object-storage.nhncloudservice.com/v1/AUTH_1234567890"
NHN_CONTAINER="backups"
NHN_ENDPOINT="https://api-identity-infrastructure.nhncloudservice.com/v2.0/tokens"
NHN_USERNAME="test@test.com"
NHN_PASSWORD="1234"
NHN_TENANT_ID="1234567890"

# AWS S3 정보
AWS_BUCKET_NAME="my-backup-bucket"
AWS_REGION="ap-northeast-2"
AWS_ACCESS_KEY="AWS_ACCESS_KEY"
AWS_SECRET_KEY="AWS_SECRET_KEY"

# jq 설치 확인 및 설치
install_jq() {
  if ! command -v jq &> /dev/null; then
    echo "🔍 jq가 설치되어 있지 않습니다. 설치를 시작합니다..."
    if [ -f /etc/centos-release ]; then
      CENTOS_VERSION=$(rpm -q --queryformat '%{VERSION}' centos-release)
      if [[ "$CENTOS_VERSION" =~ ^7.* ]]; then
        sudo yum install -y epel-release
        sudo yum install -y jq
      elif [[ "$CENTOS_VERSION" =~ ^8.* ]]; then
        sudo dnf install -y jq
      else
        echo "❌ 지원되지 않는 CentOS 버전입니다: $CENTOS_VERSION"
        exit 1
      fi
    elif [ -f /etc/lsb-release ]; then
      sudo apt-get update
      sudo apt-get install -y jq
    else
      echo "❌ 잘못된 OS 유형입니다. 'centos' 또는 'ubuntu'를 지정해주세요."
      exit 1
    fi
  else
    echo "✅ jq가 설치되어 있습니다."
  fi
}

# PostgreSQL 클라이언트 도구 설치 확인 및 설치
install_pg_client() {
  if ! command -v pg_dump &> /dev/null; then
    echo "🔍 PostgreSQL 클라이언트 도구가 설치되어 있지 않습니다. 설치를 시작합니다..."
    if [ -f /etc/centos-release ]; then
      CENTOS_VERSION=$(rpm -q --queryformat '%{VERSION}' centos-release)
      if [[ "$CENTOS_VERSION" =~ ^7.* ]]; then
        sudo yum install -y epel-release
        sudo yum install -y postgresql${PG_VERSION}
      elif [[ "$CENTOS_VERSION" =~ ^8.* ]]; then
        sudo dnf install -y postgresql-client-${PG_VERSION}
      else
        echo "❌ 지원되지 않는 CentOS 버전입니다: $CENTOS_VERSION"
        exit 1
      fi
    elif [ -f /etc/lsb-release ]; then
      sudo apt-get update
      sudo apt-get install -y postgresql-client-${PG_VERSION}
    else
      echo "❌ 잘못된 OS 유형입니다. 'centos' 또는 'ubuntu'를 지정해주세요."
      exit 1
    fi
  else
    echo "✅ PostgreSQL 클라이언트 도구가 설치되어 있습니다."
  fi
}

# 백업 디렉토리 생성
create_backup_dir() {
  if [ ! -d "$BACKUP_DIR" ]; then
    echo "📂 백업 디렉토리가 존재하지 않습니다. 생성 중..."
    mkdir -p "$BACKUP_DIR"
    echo "✅ 백업 디렉토리 생성 완료: $BACKUP_DIR"
  else
    echo "✅ 백업 디렉토리가 이미 존재합니다: $BACKUP_DIR"
  fi
}

# NHN 토큰 가져오기
get_nhn_token() {
  REQUEST_PAYLOAD=$(cat <<EOF
{
  "auth": {
    "tenantId": "$NHN_TENANT_ID",
    "passwordCredentials": {
      "username": "$NHN_USERNAME",
      "password": "$NHN_PASSWORD"
    }
  }
}
EOF
  )

  RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "$REQUEST_PAYLOAD" "$NHN_ENDPOINT")
  TOKEN=$(echo "$RESPONSE" | jq -r '.access.token.id')

  if [ "$TOKEN" == "null" ]; then
    echo "❌ NHN 토큰을 검색하지 못했습니다. 응답: $RESPONSE"
    exit 1
  fi

  echo $TOKEN
}

# AWS CLI 설치 확인
install_aws_cli() {
  if ! command -v aws &> /dev/null; then
    echo "🔍 AWS CLI가 설치되어 있지 않습니다. 설치를 시작합니다..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    rm -rf awscliv2.zip aws
  else
    echo "✅ AWS CLI가 설치되어 있습니다."
  fi
}

# 로컬에서 오래된 백업 파일 삭제
delete_old_backups_local() {
  BACKUP_FILES=($(ls -t $BACKUP_DIR/${DB_NAME}_*.dump))
  BACKUP_COUNT=${#BACKUP_FILES[@]}

  if [ $BACKUP_COUNT -gt $MAX_BACKUPS ]; then
    DELETE_COUNT=$(($BACKUP_COUNT - $MAX_BACKUPS))
    echo "✅ FS 에서 오래된 백업 파일 $DELETE_COUNT개 삭제 중..."

    for ((i=$MAX_BACKUPS; i<$BACKUP_COUNT; i++)); do
      rm -f ${BACKUP_FILES[$i]}
      echo "✅ FS 에서 삭제 완료: ${BACKUP_FILES[$i]}"
    done
  fi
}

# NHN Cloud에서 오래된 백업 파일 삭제
delete_old_backups_from_nhn() {
  TOKEN=$(get_nhn_token)
  BACKUP_FILES=($(curl -s -H "X-Auth-Token: $TOKEN" "$NHN_STORAGE_URL/$NHN_CONTAINER" | grep "${DB_NAME}_" | sort -r))
  BACKUP_COUNT=${#BACKUP_FILES[@]}

  if [ $BACKUP_COUNT -gt $MAX_BACKUPS ]; then
    DELETE_COUNT=$(($BACKUP_COUNT - $MAX_BACKUPS))
    echo "✅ NHN Cloud 에서 오래된 백업 파일 $DELETE_COUNT개 삭제 중..."

    for ((i=$MAX_BACKUPS; i<$BACKUP_COUNT; i++)); do
      DELETE_RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null -X DELETE -H "X-Auth-Token: $TOKEN" "$NHN_STORAGE_URL/$NHN_CONTAINER/${BACKUP_FILES[$i]}")
      if [ "$DELETE_RESPONSE" -ge 200 ] && [ "$DELETE_RESPONSE" -lt 300 ]; then
        echo "✅ NHN Cloud 에서 삭제 완료: ${BACKUP_FILES[$i]}"
      else
        echo "❌ NHN Cloud 삭제 실패. 응답 코드: $DELETE_RESPONSE"
      fi
    done
  fi
}

# AWS S3에서 오래된 백업 파일 삭제
delete_old_backups_from_aws() {
  BACKUP_FILES=($(aws s3 ls s3://$AWS_BUCKET_NAME/ --region $AWS_REGION | awk '{print $4}' | grep "${DB_NAME}_" | sort -r))
  BACKUP_COUNT=${#BACKUP_FILES[@]}

  if [ $BACKUP_COUNT -gt $MAX_BACKUPS ]; then
    DELETE_COUNT=$(($BACKUP_COUNT - $MAX_BACKUPS))
    echo "✅ AWS S3에서 오래된 백업 파일 $DELETE_COUNT개 삭제 중..."

    for ((i=$MAX_BACKUPS; i<$BACKUP_COUNT; i++)); do
      aws s3 rm s3://$AWS_BUCKET_NAME/${BACKUP_FILES[$i]} --region $AWS_REGION \
        --access-key $AWS_ACCESS_KEY --secret-key $AWS_SECRET_KEY
      echo "✅ AWS S3에서 삭제 완료: ${BACKUP_FILES[$i]}"
    done
  fi
}


# 데이터베이스 백업
backup_database() {
  PGPASSWORD=$DB_PASSWORD pg_dump -U $DB_USER -h $DB_HOST -d $DB_NAME -F c -b -v --exclude-table-data="_prisma_migrations" --exclude-table-data="_MemberToNotification" -f $DUMP_FILE

  if [ $? -eq 0 ]; then
    echo "✅ 데이터베이스 백업 완료: $DUMP_FILE"
  else
    echo "❌ 데이터베이스 백업 실패"
    exit 1
  fi
}

# 백업 파일 업로드
upload_backup_to_nhn() {
  TOKEN=$(get_nhn_token)
  FILE_NAME=$(basename $DUMP_FILE)
  UPLOAD_URL="${NHN_STORAGE_URL}/${NHN_CONTAINER}/${FILE_NAME}"

  echo "☁️ NHN Cloud에 백업 파일 업로드 중..."
  UPLOAD_RESPONSE=$(curl -s -w "%{http_code}" -o upload_response.txt -X PUT \
    -H "X-Auth-Token: $TOKEN" \
    -H "Content-Type: application/octet-stream" \
    -T "$DUMP_FILE" \
    "$UPLOAD_URL")
  
  if [ "$UPLOAD_RESPONSE" -ge 200 ] && [ "$UPLOAD_RESPONSE" -lt 300 ]; then
    echo "✅ 백업 파일 업로드 완료: $UPLOAD_URL"
  else
    echo "❌ NHN Cloud 백업 파일 업로드 실패. 응답 코드: $UPLOAD_RESPONSE"
    exit 1
  fi
}

# 백업 파일 업로드 (AWS S3)
upload_backup_to_aws() {
  echo "☁️ AWS S3에 백업 파일 업로드 중..."
  aws s3 cp "$DUMP_FILE" s3://$AWS_BUCKET_NAME/ --region $AWS_REGION \
    --access-key $AWS_ACCESS_KEY --secret-key $AWS_SECRET_KEY

  if [ $? -eq 0 ]; then
    echo "✅ AWS S3 백업 파일 업로드 완료"
  else
    echo "❌ AWS S3 백업 파일 업로드 실패"
    exit 1
  fi
}

# 메인 실행
main() {
  install_jq
  install_pg_client
  create_backup_dir

  if [ "$STORAGE_TYPE" == "AWS" ]; then
    install_aws_cli
  fi

  backup_database

  # 업로드 처리
  if [ "$STORAGE_TYPE" == "NHN" ]; then
    upload_backup_to_nhn
  elif [ "$STORAGE_TYPE" == "AWS" ]; then
    upload_backup_to_aws
  fi

  delete_old_backups_local

  if [ "$STORAGE_TYPE" == "NHN" ]; then
    delete_old_backups_from_nhn
  elif [ "$STORAGE_TYPE" == "AWS" ]; then
    delete_old_backups_from_aws
  fi
}

main
