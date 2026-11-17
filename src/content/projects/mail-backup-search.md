---
title: "메일 백업 검색기"
description: "매달 zip으로 받는 메일 백업을, 압축을 풀지 않고 내 PC 안에서만 검색하는 로컬 웹 앱"
date: 2026-11-17
repo: "https://github.com/wyszkd93/X-unit-portfolio/tree/EMAIL"
pdf: "https://github.com/wyszkd93/X-unit-portfolio/blob/EMAIL/docs/%EB%A9%94%EC%9D%BC%EB%B0%B1%EC%97%85%EA%B2%80%EC%83%89%EA%B8%B0_%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%86%8C%EA%B0%9C.pdf"
tech: [Python, SQLite, "표준 라이브러리만", "Vanilla JS", Windows]
tags: [이메일, 로컬앱, 검색, 프라이버시]
license: "MIT"
status: active
cover: "/images/projects/mail-backup-search/main.png"
shot: "/images/projects/mail-backup-search/search.png"
summary: "매달 zip으로 받는 메일 백업을, 압축을 풀지 않고 내 PC 안에서만 검색하는 윈도우용 로컬 웹 앱이에요. 파이썬 표준 라이브러리만 썼고, 어떤 데이터도 밖으로 내보내지 않아요."
motivation: "보안 정책상 메일 서버에는 최근 메일만 남고, 지난 메일은 매달 전월 백업(zip)으로 내려받아요. 지난 메일 하나를 찾으려면 여러 달치 zip을 풀어 .eml 수백 개를 하나씩 열어 봐야 했고, zip 안에 zip이 들어 있는 데다 파일명·본문이 EUC-KR 계열 인코딩이라 일반 도구로는 한글이 자주 깨졌어요. 메일 원문이라 외부 검색 서비스에 올릴 수도 없었고요. 그래서 내 PC 안에서만 돌고, 백업 파일은 읽기만 하는 검색기를 직접 만들었어요."
features:
  - { icon: "📂", title: "압축 해제 없는 색인", desc: "zip(중첩 zip 포함)과 풀린 .eml을 그대로 읽어 SQLite에 색인하고, 바뀐 파일만 다시 읽어요." }
  - { icon: "🔎", title: "꼼꼼한 검색", desc: "여러 단어 AND, 정확한 문구, 제외어. 제목·보낸사람·받는사람·본문·첨부파일명 범위를 지정해요." }
  - { icon: "🗂️", title: "아웃룩형 3단 화면", desc: "메일함·연월 트리에서 목록(무한 스크롤)을 보고, 본문 미리보기에 검색어를 강조해요." }
  - { icon: "📎", title: "첨부·원본 그대로", desc: "첨부 저장, 본문 속 이미지 표시, 원본 .eml 저장(아웃룩에서 바로 열려요)." }
  - { icon: "⏱️", title: "가져오기·자동 반영", desc: "받은 zip을 메일 날짜 기준 연월 폴더로 정리하고, 새 백업이 생기면 자동으로 반영해요." }
  - { icon: "📦", title: "설치 없는 배포", desc: "파이썬 임베디드 패키지를 함께 담은 zip 하나. 바탕화면 바로가기·자동 실행을 제공해요." }
notes:
  - { title: "한글 인코딩", desc: "ks_c_5601-1987 선언 뒤에 CP949 확장 문자가 섞여 있어 별칭을 모두 cp949로 매핑했고, zip 파일명은 cp437로 해석된 걸 다시 cp949로 복원했어요." }
  - { title: "로컬 웹 앱의 보안", desc: "127.0.0.1에만 바인딩, DNS 리바인딩 차단, POST에 커스텀 헤더와 Origin 검사(CSRF), 본문은 sandbox iframe과 CSP로 스크립트를 막았어요." }
  - { title: "설치 없는 더블클릭 배포", desc: "파이썬 없는 PC를 위해 공식 임베디드 패키지(SHA256 대조)를 동봉하고, bat 한글 깨짐은 ASCII bat과 powershell EncodedCommand로 우회했어요." }
  - { title: "윈도우 중복 실행 방지", desc: "SO_REUSEADDR가 윈도우에선 이미 쓰는 포트에도 바인딩돼 서버가 둘 뜨던 문제를 SO_EXCLUSIVEADDRUSE로 막았어요." }
---

## 써 보기 (데모 데이터)

```bash
python make_demo.py                          # 가상의 메일 백업 169통 생성 → demo/
python mail_search.py --data-dir demo/data   # http://127.0.0.1:8790
```

실제 백업으로 쓸 땐 `python mail_search.py`를 실행하고, 처음 뜨는 창에서 백업 zip을 모아 둔 폴더를 고르면 돼요.
