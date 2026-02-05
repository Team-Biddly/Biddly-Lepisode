# Biddly-Lepisode
### 비들리의 신규 기능 구현 시, 다음 절차를 따름.
1. Lepisode에게 최신화 소스 코드 수령
2. 해당 Repo에 수령한 코드와 구현한 코드 푸쉬
3. 로컬에서 호스팅까지 테스트
4. 테스트 성공 시, 노션으로 문서화 및 연동 코드 전달 
#### 전달 시 env 파일 모두 제외하고 보낼 것!

---

## 로컬 실행 (의존성·환경 확인)

python-FileEngine 없이 기존 Biddly 코드만 로컬에서 실행할 때 참고용입니다.  
(env는 임의 값 사용, 실제 키가 아니므로 주요 기능 동작은 미확인)

### 사전 요구사항
- Node.js (LTS 권장)
- PostgreSQL (서버·DB 연동 시)
- `bidly` 폴더가 프로젝트 루트

### 환경 변수
- **`bidly/apps/server/.env`**  
  - DB 스키마 적용(`db:push`)·Prisma Studio 등은 이 파일을 사용합니다.  
  - 없으면 `bidly/apps/server/.env.example`을 복사한 뒤 `cp apps/server/.env.example apps/server/.env` 후 값 채우기.
- **`bidly/.env`**  
  - `nx serve server` 실행 시 **현재 작업 디렉터리(cwd)가 `bidly`**이므로, 서버가 `dotenv`로 읽는 `.env`는 `bidly/.env`입니다.  
  - `apps/server/.env` 내용을 그대로 복사해 `bidly/.env`로 두거나, 동일한 값으로 `bidly/.env`를 만들어 두세요.

`.env.example`에는 `DATABASE_URL` 등 필요한 변수 목록이 있으니 참고하세요.

### 실행 순서 (bidly 폴더에서)
```bash
cd bidly

# 의존성 설치 (peer dependency 충돌 시)
npm install --legacy-peer-deps

# Prisma 클라이언트 생성
npx prisma generate

# (선택) PostgreSQL 사용 시 스키마 반영
npm run db:push

# 서버 (포트 3000). 반드시 bidly/.env 존재
npx nx serve server

# 별도 터미널에서 클라이언트(4200), 관리자(4201)
npx nx serve client
npx nx serve admin
```

- **서버**: `http://localhost:3000`  
- **클라이언트**: `http://localhost:4200`  
- **관리자**: `http://localhost:4201`  

첫 실행 시 `nx serve server`는 빌드 때문에 시간이 걸릴 수 있습니다.

## Architecture
1. 나라장터 수집 (Node.js): API를 통해 공고와 파일 정보를 가져옵니다.
2. 파일 업로드 (Node.js): 원본 파일을 NHN Cloud(S3)에 업로드하고 S3 URL을 얻습니다.
3. DB 기록 (Node.js): PostgreSQL의 Convert 테이블에 bidId, url, isConverted: false 상태로 저장합니다.
4. 작업 인지 (Python): (폴링/감시): 파이썬이 스스로 DB를 10초마다 체크해서 isConverted: false인 목록이 있는지 확인하고 가져옵니다.
5. 변환 작업 (Python): DB에서 받은 URL로 NHN Cloud에서 파일을 다운로드하여 텍스트를 추출합니다.
6. 결과 저장 (Python): 추출된 텍스트를 다시 PostgreSQL의 해당 레코드에 업데이트하고 isConverted: true로 변경합니다.
7. 검색 및 조회 (Node.js): 사용자가 검색하면 Node.js는 DB에서 isConverted: true인 데이터들만 검색 결과에 포함시킵니다.

## 변경 사항
<details markdown="1">
<summary><strong> 01.30(금) - 로컬 테스트 환경 설정 </strong></summary>

### apps\server\src\app\bid\bid-sync.service.ts

**변경 내용**

`563~566 줄` 아래 내용 추가
  ```
  // OPENAI_API_KEY가 없으면 AI 호출 없이 간단 추출만 사용 (로컬/임시 env 시 401 방지)
  if (!process.env.OPENAI_API_KEY?.trim()) {
    return extractSimpleKeywords(`${data.bidNtceNm} ${content}`);
  }
  ```

---

### apps\server\src\app\storage\storage.service.ts

**변경 내용**

`57줄, 84~88줄` try문 추가
  ```
  async onModuleInit() {
      try {                              // 54줄 추가
      ...
      } catch (err) {                    // 84~88줄 추가
        this.logger.warn(
          'Storage endpoint unreachable (local dev without MinIO?). File upload will fail until S3 is available.',
        );
      }
  ```
</details>

---

<details markdown="1">
<summary><strong> 02.02(월) ~ 02.03(화) - Python 엔진 연동</strong></summary>

### prisma\models\file.prisma

**변경 내용**

`file.prisma`에 변환 여부를 확인하기 위한 `isConverted`를 추가

```
/// 문서 변환 여부
isConverted        Boolean? @default(false)
```

---

### apps\python-FileEngine

**변경 내용**

`main.py`의 테스트 코드 와 `database.py` 삭제

`main.py`에 S3 URL을 인자로 받고, 변환한 text를 return하는 API 생성

---

### apps\server\src\app\storage\storage.service.ts

**변경 내용**

`2, 18, 37번 줄` import 및 의존성 추가
```
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
    private readonly httpService: HttpService,
```

`94 ~ 131번 줄`에 text로 변환하는 Background Trigger 작성

```
private triggerTextExtraction(file: File) {
  ...
}
```

`187 ~ 188, 268 ~ 269번 줄`에 Trigger 호출

```
// 텍스트 변환 트리거 백그라운드 실행
this.triggerTextExtraction(created);
```

---

### apps\server\src\app\bid\bid.service.ts

**변경 내용**

`161~176번 줄` 변환된 파일 검색 추가
```

// Search in converted files' content
const matchedFiles = await this.prisma.file.findMany({
  where: {
    isConverted: true,
    content: { contains: query, mode: 'insensitive' },
  },
  select: { url: true },
});

if (matchedFiles.length > 0) {
  const fileUrls = matchedFiles.map((f) => f.url);
  where.OR.push({
    공고규격서URL: { hasSome: fileUrls },
  });
}
```

</details>

---

