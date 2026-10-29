# Homepage

[Astro](https://astro.build)로 만든 개인 홈페이지 + 블로그입니다.
배포 주소: https://wyszkd93.github.io/Homepage/

## 구조

| 경로 | 내용 |
| --- | --- |
| `src/consts.ts` | 이름, 소개, 관심 분야, 스택, 프로젝트, 연락처 — **소개 페이지 내용은 여기서 수정** |
| `src/content/blog/` | 블로그 글 (마크다운). 파일 하나 = 글 하나 |
| `src/pages/` | 페이지: 소개(`/`), 블로그 목록·글, 태그, RSS(`/rss.xml`) |
| `src/styles/global.css` | 디자인 (라이트/다크 색상 변수) |
| `public/images/` | 글에 쓰는 이미지 |
| `src/assets/` | 모구 캐릭터 그림 (`mogu.webp`, 얼굴 `mogu-face.webp`) |
| `scripts/import-tistory.mjs` | Tistory 글 가져오기 스크립트 |
| `.github/workflows/deploy.yml` | `main`에 push하면 GitHub Pages로 자동 배포 |

## 로컬에서 실행

```bash
npm install
npm run dev      # http://localhost:4321/Homepage/
npm run build    # dist/ 에 정적 파일 생성
```

## 글 쓰기

`src/content/blog/<이름>.md` 파일을 만듭니다. 파일 이름이 주소가 됩니다(`/blog/<이름>/`).

```md
---
title: 글 제목
description: 목록에 보일 요약 (선택)
date: 2026-10-29
tags: [태그1, 태그2]
draft: false      # true면 배포되지 않음
---

본문. 이미지는 public/images/ 에 두고 ![설명](/images/파일.png)
```

마크다운 안의 `/images/...` 같은 경로에는 `/Homepage`가 자동으로 붙습니다.

## Tistory 글 가져오기

```bash
npm run import:tistory -- <블로그ID>                # https://<블로그ID>.tistory.com/rss 의 글
npm run import:tistory -- <블로그ID> --ids 1-300    # RSS에 없는 옛 글: 글 번호로 직접 수집
```

- 결과: `src/content/blog/tistory/<글번호>.md`, 이미지는 `public/images/tistory/<글번호>/`
- 이미지 다운로드가 실패하면 원본 주소를 그대로 둡니다(`--no-images`로 다운로드 생략).
- 이미 있는 파일은 건너뜁니다. 다시 받으려면 `--force`. 미리보기만 하려면 `--dry-run`.
- RSS 본문이 요약만 있으면 `--full`로 각 글 페이지에서 본문을 가져옵니다.
- Tistory RSS는 최근 글 일부만 담습니다(블로그 관리 → 설정에서 RSS 공개 개수 조정 가능). 전체를 옮기려면 `--ids` 를 쓰세요.

## 배포

`main` 브랜치에 push하면 GitHub Actions가 빌드 후 GitHub Pages에 배포합니다.
처음 한 번은 저장소 **Settings → Pages → Build and deployment → Source** 를 **GitHub Actions** 로 바꿔야 합니다.
