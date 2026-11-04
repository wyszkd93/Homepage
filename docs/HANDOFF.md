# 작업 기록 (2026-11-04 기준)

다음에 작업을 이어갈 때 이 문서부터 읽으면 됩니다.

- 사이트: https://wyszkd93.github.io/Homepage/
- 저장소: `wyszkd93/Homepage` (main 브랜치에 push되면 GitHub Actions가 자동 배포)
- 백업 시점 커밋: `cc4cc38` (2026-11-04 main) — 이 시점으로 되돌릴 때 기준 (이전 백업 `c985751`, 2026-10-29)
  - 태그: `backup-2026-11-04` → `cc4cc38`, `backup-2026-10-29` → `c985751` (GitHub에 올라감)
  - 태그 push는 클라우드 세션에서 403으로 막힘 → 새 백업 태그는 PC Git Bash에서 `git tag -a backup-<날짜> <커밋> -m "..."` 후 `git push origin backup-<날짜>`
- 작업 규칙: 저장소 루트 `CLAUDE.md` (데이터는 필요한 것만 호출, 출력은 극도로 간결)
- 구조 그림: `docs/architecture.html` (사이트에는 안 올라감)

## 지금까지 한 것

- **사이트 기본**: Astro, 밝은 톤 디자인, 다크 모드, 모구(mogu) 캐릭터, 검색(Ctrl+K 또는 `/`), 코드 복사 버튼, 이메일 안내창
- **티스토리 이전**: study-storage93.tistory.com 글 86개를 이전했습니다(2026-11-03 공개 전환된 9건 추가: 22·23·24·26·30·33·36·39·59). 이미지와 첨부파일도 함께 옮겼습니다.
  - 첨부파일은 `public/files/tistory/`에 있습니다. 반드시 유지합니다.
  - 72·73번 글은 목차를 직접 손봤기 때문에 `--force`로 다시 가져오면 수정 내용이 사라집니다.
- **카테고리**: 분야(platform) › 주제(topic) 2단 구조입니다. `src/categories.ts`에 정의되어 있습니다.
  - 분야: Oracle, MySQL·MariaDB, PostgreSQL, Tibero, IBM MQ, OS. 글이 없는 분야는 화면에 나오지 않습니다.
  - 블로그 사이드바는 분야별로 접고 펼치는 방식입니다.
- **직접 쓴 글**: IBM MQ runmqsc 명령어 모음 (`src/content/blog/ibm-mq-runmqsc.md`)
- **스니펫 페이지**: Oracle 11개, IBM MQ 4개 (`src/data/snippets.ts`)
- **유용한 기능 (홈 카드)**: SQL 포매터, Cron 해석기, 퇴근·주말 타이머 (`/tools/...`)
  - 카드 목록은 `src/data/tools.ts`에 있습니다. 도구를 추가할 때는 `src/pages/tools/<slug>.astro` 파일을 만들고 이 목록에 한 줄을 넣습니다.
  - 모두 브라우저에서만 동작하며, 설정값은 그 브라우저에만 저장됩니다.
- **쉬어가기 (홈 카드)**: 플래피 모구(도트), 과일 합치기, 2048, 모구의 사주 카페 (`/games/...`)
  - 카드는 같은 `src/data/tools.ts`에서 `kind: 'game'`으로 구분합니다.
  - 과일 합치기는 물리 엔진 `matter-js`를 씁니다.
  - 플래피 모구 캐릭터는 사용자가 Gemini로 만든 도트 그림을 줄여 쓴 스프라이트 시트(`src/assets/flappy-mogu.png`)입니다. 날개 위·가운데·아래 3장(각 64×57)이 들어 있습니다. 그림을 바꿀 때는 같은 크기의 3장짜리 시트로 교체합니다.
  - 사주 카페: 계산은 `src/utils/saju.ts`, 풀이(십성·신강약·용신·대운·세운·개운)는 `src/utils/saju-reading.ts` (일주 기준 1900-01-01 甲戌, 절기는 평균 날짜로 근사). 오늘의 운세는 오늘 일진과 일간의 오행 관계 + 생일·날짜 고정 난수
  - 최고 점수, 진행 중인 2048 판, 사주 입력값은 그 브라우저에만 저장됩니다.
  - 뽁뽁이는 사주 카페로 교체하며 삭제했습니다.
  - 모구의 견생 한 바퀴(`/games/dog-life/`): 태어나면 견생 등록증 → 픽셀 장면(`src/utils/dog-scene.ts`: 사는 곳 배경·계절·가족·걷는 강아지·사건 말풍선, 240×110 캔버스 확대). 끝나면 어두운 화면에 '마지막 해' 문구와 강아지가 가족에게 남긴 말(`lastWords()`: 가족 첫 문장 + 실제 기억·고른 선택·성격·숫자 중 무작위 3개 + 마무리, '고마워'·같은 문장 중복 방지, 결과 화면에도 표시). 가족의 선택은 나이대 5개마다 후보 5~6개(총 28개) 중 하나씩. 선택은 흔적(flags)을 남겨 뒤에 이어지는 사건이 생기고(동생 입양 → 장면에 동생 강아지 등), 가족 변화(결혼·아기·독립·손주) 시 장면 속 가족도 바뀜, 희귀 사건 ✨ 7종, 끝에 견생 칭호 최대 3개(`titlesOf`). 배경음악은 `src/utils/bgm.ts`(WebAudio 오르골, 평소·노견·마지막 장면 3가지 분위기, 켬/끔은 브라우저에 저장)(`CHOICE_BANDS`) → 기억들이 픽셀 장면과 함께 스쳐 지나가는 장면(탭으로 넘김, 건너뛰기) → 결과. 무작위 견종·가족·성격으로 태어나 1년≈4.5초(1×)로 일생 진행, 5번의 가족 선택, 끝나면 요약 카드·카톡 공유·지난 견생 기록(브라우저 저장). 엔진·사건·견종 수명(대략값)은 `src/utils/dog-life.ts`
  - 결과 공유 링크: 게임 3종은 랭킹 결과 창 '카톡으로 자랑하기' → `?r=`(점수·닉네임)로 친구 기록 배너, 견생은 `?r=견종.이름.가족.성격.나이×10.산책.간식.친구.점수`(목록 번호, 카카오 모바일 10KB 제한 때문에 짧게)로 마지막 화면. 버튼은 '결과 보기'·'나도 해보기'(`?from=kakao`). 인코딩은 `src/lib/share-param.ts`
  - 1in8b Engine API는 사람 시뮬레이션 전용이고 키를 공개 사이트에 넣을 수 없어 쓰지 않음
  - 사주 카페 결과 공유: 결과 요약 카드(`src/utils/saju-card.ts`, 캔버스 800x800)를 카카오 서버에 올려(uploadImage) 카드 이미지로 사용, 실패 시 사주 모구 그림. 카드 아래 일간·구조·용신·오늘 총운 목록
  - 공유 카드 본문·'결과 보기'는 `?s=`(생년월일|시|성별 base64url)로 공유한 사람의 결과를 보여 줌(저장 안 함, 입력폼 숨김), '나도 해보기'는 `?from=kakao`로 빈 화면
  - 사주 카페 페이지 상단 그림·링크 미리보기: `src/assets/saju-mogu.webp`
  - 카카오톡 공유: `src/components/KakaoShare.astro`(게임 페이지 하단 버튼) + 랭킹 결과 창 '카톡으로 자랑하기'. 키는 `src/consts.ts`의 `KAKAO_JS_KEY`(비우면 버튼 숨김), 카카오 콘솔에 사이트 도메인 `https://wyszkd93.github.io` 등록 필요
- **게임 공용 랭킹 (Firebase)**: 플래피 모구·과일 합치기·2048 (`src/components/Leaderboard.astro`)
  - Firebase 프로젝트 `mogu-homepage` (무료 Spark 요금제), 로그인은 Google, DB는 Firestore 서울(asia-northeast3)
  - 설정: `src/lib/firebase.ts` (공개용 웹 config), 보안 규칙: 저장소 루트 `firestore.rules` → **콘솔 Firestore → 규칙 탭에 붙여넣고 게시해야 적용**
  - 데이터: `leaderboards/{게임}/scores/{uid}` = { name, score, updatedAt }, 본인 문서만, 기존 이상 점수만 쓰기 가능
  - 게임은 끝날 때 `window`에 `game:score` 이벤트를 보내고 패널이 최고 기록일 때만 저장
  - 개인정보 처리방침: `/privacy/` (푸터 링크)
  - 화면 흐름: 게임 위 상태 바, 로그인 안 한 상태로 게임 페이지에 들어올 때마다 로그인 안내 창, 판이 끝나면 결과 창(이번 점수·TOP 10·다시 하기). 게임은 `game:score`에 `final: true`를 붙여 판 종료를 알리고 `game:retry`로 다시 시작
  - 보안 설정 (2026-10-30)
    - 암호화: 전송 구간 HTTPS(TLS), 저장 데이터는 Google 기본 암호화(AES-256). 공개 랭킹 데이터라 앱 단 암호화는 하지 않음
    - Firestore 규칙 게시 완료 (에뮬레이터 22개 경우 통과). 읽기는 공개, 쓰기는 본인·기존 이상 점수·상한 이하만
    - API 키 제한 (Google Cloud 콘솔 → API 및 서비스 → 사용자 인증 정보 → Browser key)
      - 웹사이트: `https://wyszkd93.github.io/*`, `https://mogu-homepage.firebaseapp.com/*`
      - API: Identity Toolkit, Token Service, Cloud Firestore 3개만. 다른 사이트에서 로그인 API 호출은 차단 확인
    - Authentication 승인된 도메인에서 `localhost` 삭제
    - Firestore는 API 키 없이도 요청을 받으므로 키 제한이 적용되지 않음 (규칙이 보호)
    - App Check(reCAPTCHA v3)는 보류. 읽기 급증이나 이상 점수가 보이면 적용
      - 적용 시 API 키 허용 목록에 `Firebase App Check API`를 추가해야 함
  - 로컬 테스트: `PUBLIC_FIREBASE_EMULATOR=1 npm run build` → Firebase 에뮬레이터(auth 9099, firestore 8080)에 붙고 `window.__testSignIn(uid)`로 로그인. 배포 빌드에는 들어가지 않음
  - 예전 게임(모구 점프, SQL 타자 연습)은 '재미없다'는 의견으로 삭제했습니다.
- **AI 픽** (`/picks/`, 상단 메뉴): 링크 하나를 큐레이션 카드로. 항목은 `src/content/picks/*.md`(스키마 `src/content.config.ts`), 카드 `src/components/PickCard.astro`. 올리는 절차는 `.claude/skills/ai-pick/SKILL.md`(원문 본문 복사 금지, 요약은 직접 작성, 원본은 공개된 한 줄 설명만)
- **소개 페이지**: `/about/` (`src/pages/about.astro`, 상단 메뉴 '소개'). 모구 그림 + 말풍선 인사, '모구 한눈에 보기' 카드 4장(관심·스택·블로그·연락). 손글씨 글꼴 Gaegu는 이 페이지에만 로드
  - 관심 분야·기술 스택·링크는 `src/consts.ts`의 `PROFILE`에서 가져옵니다. 메인 홈의 소개 섹션도 같은 데이터를 씁니다.
  - 회사명, 재직 기간 같은 회사 관련 내용은 넣지 않기로 했습니다.
  - 프로젝트 섹션은 내용이 비어 있어서 숨겨 두었습니다.
- **RSS**: 화면 링크만 숨겼습니다. 주소(`/rss.xml`)는 그대로 살아 있습니다.

## 2026-10-30 ~ 11-04 추가·변경

- **유용한 기능 추가**: tnsnames.ora 만들기(`/tools/tnsnames/`), 실행계획 보기(`/tools/xplan/`, `src/utils/xplan.ts`, 500단계 넘으면 접기, 2만 단계 약 2.7초), 정규식 테스터(`/tools/regex/`, Oracle REGEXP → JS 변환 `src/utils/oregex.ts`). JS로 만든 요소는 `<style is:global>` 필요
- **홈 카드 NEW**: `src/data/tools.ts`의 `added` 날짜(처음 생성일) 기준 3일(`NEW_DAYS`, 한국 시간) 동안만 표시
- **견생 한 바퀴**: 이름 짓기 단계 → 견생 등록증, 다시 태어나기는 이름 유지·프로필만 새로, 가족 10종·사는 곳 5종(도시·주택·농가·바다·한옥), 선택지 70개, 고양이 동생 장면, 행복지수는 기쁨 누적 기반(`lifeScore`). 지난 견생 기록 저장 없음
- **사주 카페·견생**: 항상 처음 화면부터(브라우저 저장 안 함). 2048·과일 합치기·플래피는 Firestore 랭킹이라 그대로
- **AI 픽**: 5개씩 페이지(`/picks/page/N/`), 제목 앞 종류 배지(GitHub·기사·블로그·논문·영상, `PickKind.astro`), 요약은 "우리 식" 3단 구성(SKILL.md)
  - 매일 07:47(한국 시간) 예약 작업 `trig_0155TrQAYWat1H9zKEXGphzv`(AI 픽 매일 아침 자동 업로드)가 **세션 `session_01WHY3gUYenEJhL4DNF7Xebt`로** 실행됨. 새 세션에서 이어 하려면 이 예약 작업의 대상 세션을 바꾸거나 새로 만들어야 함
- **방문 통계 (GoatCounter)**: `https://mogu-dba.goatcounter.com`, 푸터 `오늘 N  누적 방문 N` (`VisitCount.astro`), 0이면 숨김. 블로그 글 조회수는 뺐음. 개인정보 처리방침 5항 추가
  - 미해결: 대시보드는 방문이 잡히는데 공개 카운터 JSON이 0을 돌려줌 → 숫자 줄이 안 보임
- **블로그 정리**: 태그 없던 76개 글 태그, 가짜 소제목 → `##`, 명령어·터미널 출력 → 코드 블록, `이름 : 설명` → 표(폰에선 위아래로), 긴 설명 → 인용 상자, 89번 에디션 비교 ○/✕ 표
  - 티스토리 15번(보호글 → 공개 전환) 가져옴. 지금도 비공개: 1, 2, 52, 74, 92~95
  - 첨부파일 8개(12·26·32·58번) 전부 있음. 71번 그림 1장은 원본 주소가 403이라 못 가져옴(직접 저장해 주면 넣기)
  - 가져오기 스크립트는 클라우드 환경에서 `NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt` 필요

## 다음에 할 수 있는 것

- [ ] 프로젝트 섹션 내용 넣기: `src/consts.ts`의 `PROFILE.projects`를 채우면 섹션이 자동으로 나타납니다.
- [ ] 검색엔진 등록
  1. Google Search Console과 네이버 서치어드바이저에서 받은 인증 meta 값을 `SITE.verification`에 넣습니다.
  2. 인증 후 `sitemap-index.xml`과 `rss.xml`을 제출합니다.
- [ ] 새 글 추가
  - `src/content/blog/`에 `.md` 파일을 만들고 `platform`, `topic`을 지정합니다.
  - 티스토리 글은 `npm run import:tistory -- study-storage93`로 가져옵니다.
- [ ] 오픈소스 DB(MySQL·MariaDB, PostgreSQL) 글이 생기면 해당 분야가 자동으로 표시됩니다.

- [ ] GoatCounter 공개 카운터가 0을 주는 원인 확인 (설정·캐시·내 방문 제외 여부)
- [ ] 71번 글 빠진 그림 넣기
- [ ] PWA·안드로이드 앱 형태 배포 (보류)
- [ ] 관리자 로그인 (보류): Firebase Google 로그인 + Firestore 규칙에 관리자 UID. 후보 기능: 랭킹 관리(삭제·초기화), 문의하기·방명록, 통계, 문구 수정. 블로그 글 쓰기는 GitHub 연동 CMS가 필요해 난이도 높음
- [ ] 카카오 카드 목록·앱 이름을 누르면 404: 카카오가 앱 기본 주소(https://wyszkd93.github.io)로 보냄. 제품 링크 관리에 `/Homepage` 추가 시도 또는 `wyszkd93.github.io` 저장소(루트 → /Homepage/ 이동) 생성

## 작업 방식 메모

- 작업 브랜치에서 수정 → PR → CI 빌드 통과 후 merge → main 배포를 확인합니다.
- 배포는 사용자가 "배포해줘"라고 할 때만 (AI 픽 예약 작업은 예외: 미리 허락됨). 그 전엔 빌드 + 미리보기 스크린샷을 먼저 보여 줌
- 사용자 취향
  - 문구 사이 가운뎃점(·) 구분 싫어함 → 줄바꿈이나 한 줄 문장으로
  - 블로그 정리 시 문장 내용은 그대로, 모양만 (소제목·코드 블록·표·인용 상자). 글만 길게 이어지면 상자·표로
  - 화면이 복잡해지는 것 싫어함 (예: 홈 소개 아래 방문 수는 뺌)
- 공개해도 되는 키: Firebase 웹 config, Kakao JS 키. 그 외 비밀 키는 저장소에 넣지 않음
- GitHub 사용자명(wyszkd93)과 저장소 이름(Homepage)은 바꾸지 않습니다. 주소는 `/Homepage/`로 유지합니다.
- 로컬 확인 순서:
  1. `npm install`
  2. `npm run build`
  3. `npx astro preview`
