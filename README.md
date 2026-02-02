# Biddly-Lepisode
### 비들리의 신규 기능 구현 시, 다음 절차를 따름.
1. Lepisode에게 최신화 소스 코드 수령
2. 해당 Repo에 수령한 코드와 구현한 코드 푸쉬
3. 로컬에서 호스팅까지 테스트
4. 테스트 성공 시, 노션으로 문서화 및 연동 코드 전달 
#### 전달 시 env 파일 모두 제외하고 보낼 것!

---

## 1단계: 로컬 실행 (의존성·환경 확인)

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
  - `nx serve server` 실행 시 **현재 작업 디렉터리(cwd)가 `bidly`**이므로, 서버가 `dotenv`로 읽는 `.env`는 **`bidly/.env`**입니다.  
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

### (선택) FileEngine — 문서 파싱 (HWP/DOC/PDF → 텍스트)

입찰 공고 규격서 등 문서를 텍스트로 변환할 때, Node 서버는 **Python FileEngine**을 먼저 사용할 수 있습니다.  
설정하지 않으면 기존 방식(HWP/Word만, PDF 미지원)으로 동작합니다.

1. **Python FileEngine 실행**
   ```bash
   cd bidly/apps/python-FileEngine
   python -m venv .venv
   .venv\Scripts\activate   # Windows
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
2. **Node 서버에 URL 설정**  
   `bidly/.env` 또는 `bidly/apps/server/.env`에 추가:
   ```env
   FILE_ENGINE_URL=http://localhost:8000
   ```
3. 서버 재시작 후, 문서 파싱 시 FileEngine이 사용되며 **PDF** 변환도 가능합니다.  
   FileEngine이 없거나 실패 시 자동으로 기존 HWP/Word 파서로 폴백합니다.

## 변경 사항
<details markdown="1">
<summary><strong> 01.30(금) </strong></summary>

- apps\server\src\app\bid\bid-sync.service.ts (563~566 줄 아래 내용 추가)
  ```
  // OPENAI_API_KEY가 없으면 AI 호출 없이 간단 추출만 사용 (로컬/임시 env 시 401 방지)
  if (!process.env.OPENAI_API_KEY?.trim()) {
    return extractSimpleKeywords(`${data.bidNtceNm} ${content}`);
  }
  ```

- apps\server\src\app\storage\storage.service.ts (try문 추가 57줄, 84~88줄)
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
<details markdown="1">
<summary><strong> 02.01(월) </strong></summary>

### # prisma\models\file.prisma

**변경 내용**

파일 내 검색과 일반 검색을 통합하기 위하여 file.prisma에 변환 여부를 확인하기 위한 isConverted를 추가.

<aside>

/// 문서 변환 여부
isConverted        Boolean? @default(false)

</aside>

### # apps\server\src\app\app.module.ts

**변경 내용**

모듈화 시킨 파이썬 엔진을 import만.

<aside>

import { FileEngineModule } from '../../../../libs/api-client/src/file-engine/file-engine.module';
import { PythonFileEngineModule } from './python-file-engine/python-file-engine.module'; 

</aside>

### # apps\server\src\app\python-file-engine\python-file-engine.controller.ts

**변경 내용**

<aside>
FileEngineService를 주입받아 그 메서드를 호출하는 테스트 목적의 컨트롤러

</aside>

### # apps\server\src\app\python-file-engine\python-file-engine.module.ts

**변경 내용**

<aside>

apps/server 애플리케이션 내부에서 FileEngineModule을 import하고,
PythonFileEngineController를 controllers 배열에 포함하여 테스트 엔드포인트를 노출하는 모듈

</aside>

### # libs\api-client\src\file-engine\file-engine.module.ts

**변경 내용**

<aside>

위 서비스를 HttpModule, ConfigModule과 함께 묶어 외부 NestJS 프로젝트에서 사용할 수 있도록
export하는 모듈. 이 모듈은 api-client 라이브러리의 일부로, 재사용성을 위해 설계.

</aside>

### # libs\api-client\src\file-engine\file-engine.service.ts

**변경 내용**

<aside>
Python FastAPI와 실제 통신하는 로직을 담고 있는 핵심 서비스

</aside>

### # libs\api-client\src\file-engine\interfaces\file-engine.interface.ts

**변경 내용**

<aside>
Response 타입 힌트를 주는 Interface

</aside>
</details>