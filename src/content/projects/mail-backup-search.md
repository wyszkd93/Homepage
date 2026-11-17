---
title: "메일 백업 검색기"
description: "매달 zip으로 받는 메일 백업을, 압축을 풀지 않고 내 PC 안에서만 검색하는 로컬 웹 앱"
date: 2026-11-17
repo: "https://github.com/wyszkd93/X-unit-portfolio/tree/EMAIL"
tech: [Python, SQLite, "표준 라이브러리만", "Vanilla JS", Windows]
tags: [이메일, 로컬앱, 검색, 프라이버시]
status: done
---

회사에서 매달 받는 **메일 백업 zip**을 압축을 풀지 않고 바로 검색하는 윈도우용 로컬 웹 앱이에요. 파이썬 표준 라이브러리만 써서 만들었고, 파이썬이 안 깔린 PC에서도 zip을 풀고 더블클릭하면 실행돼요. 메일 내용이 담긴 파일이라 **어떤 데이터도 밖으로 내보내지 않는 것**을 최우선으로 설계했어요.

![메인 화면 (가상의 데모 데이터)](/images/projects/mail-backup-search/main.png)

> 스크린샷은 모두 `make_demo.py`로 만든 **가상의 회사·사람·메일**이에요(실제 메일 아님).

## 왜 만들었나

보안 정책상 메일 서버에는 최근 메일만 남고, 지난 메일은 매달 **전월 백업(zip)**으로 내려받아요. 그래서 지난 메일 하나를 찾으려면 여러 달치 zip을 풀어 `.eml` 수백 개를 하나씩 열어 봐야 했어요. 게다가 zip 안에 zip이 들어 있고, 파일명·본문이 `ks_c_5601-1987`(EUC-KR 계열) 인코딩이라 일반 도구로는 한글이 자주 깨졌어요. 메일 원문이라 외부 검색 서비스에 올릴 수도 없었고요. 그래서 **내 PC 안에서만 돌고, 백업 파일은 읽기만 하는** 검색기를 직접 만들었어요.

## 주요 기능

- **압축 해제 없는 색인**: zip(중첩 zip 포함)과 풀린 `.eml`을 그대로 읽어 SQLite에 색인하고, 바뀐 파일만 다시 읽는 증분 색인
- **검색**: 여러 단어 AND, `"정확한 문구"`, `-제외어`. 제목·보낸사람·받는사람·본문·첨부파일명 범위 지정
- **아웃룩형 3단 화면**: 메일함·연월 트리 → 메일 목록(무한 스크롤) → 본문 미리보기(검색어 강조)
- **첨부·원본**: 첨부 저장, 본문 속 이미지(cid) 표시, 원본 `.eml` 저장(아웃룩에서 열림)
- **백업 가져오기·자동 반영**: 받은 zip을 메일 날짜 기준으로 연월 폴더에 정리, 다운로드 폴더에 새 백업이 생기면 자동으로 반영
- **설치 없는 배포**: 파이썬 임베디드 패키지를 함께 담은 zip 하나. 바탕화면 바로가기·로그인 시 자동 실행 제공

![검색 결과와 본문 미리보기 (가상의 데모 데이터)](/images/projects/mail-backup-search/search.png)

## 기술적으로 고민한 점

- **한글 인코딩**: `ks_c_5601-1987` 선언 뒤에 CP949 확장 문자가 섞여 있어 별칭을 모두 `cp949`로 매핑했고, zip 파일명은 `cp437`로 해석된 걸 다시 `cp949`로 복원했어요.
- **로컬 웹 앱의 보안**: 메일 원문을 다루니 "내 PC의 다른 웹페이지"도 위협으로 봤어요. `127.0.0.1`에만 바인딩, DNS 리바인딩 차단(Host 검사), POST에 커스텀 헤더+Origin 검사(CSRF), 본문은 `sandbox` iframe + `CSP: default-src 'none'`으로 스크립트 실행 차단.
- **설치 없는 더블클릭 배포**: 파이썬 없는 PC를 위해 공식 임베디드 패키지(SHA256 대조)를 동봉하고, bat 한글 깨짐은 ASCII bat + `powershell -EncodedCommand`로 우회했어요.
- **윈도우 중복 실행**: `http.server`의 `SO_REUSEADDR`가 윈도우에선 이미 쓰는 포트에도 바인딩돼 서버가 둘 뜨는 문제를 `SO_EXCLUSIVEADDRUSE`로 막았어요.

## 써 보기 (데모 데이터)

```bash
python make_demo.py                          # 가상의 메일 백업 169통 생성 → demo/
python mail_search.py --data-dir demo/data   # http://127.0.0.1:8790
```

실제 백업으로 쓸 땐 `python mail_search.py`를 실행하고, 처음 뜨는 창에서 백업 zip을 모아 둔 폴더를 고르면 돼요.

## 더 보기

- 소스: [github.com/wyszkd93/X-unit-portfolio (EMAIL 브랜치)](https://github.com/wyszkd93/X-unit-portfolio/tree/EMAIL)
- 프로젝트 소개서(PDF, 6쪽): [docs/메일백업검색기_프로젝트소개.pdf](https://github.com/wyszkd93/X-unit-portfolio/blob/EMAIL/docs/%EB%A9%94%EC%9D%BC%EB%B0%B1%EC%97%85%EA%B2%80%EC%83%89%EA%B8%B0_%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%86%8C%EA%B0%9C.pdf)
- 라이선스: MIT
