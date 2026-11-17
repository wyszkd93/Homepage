---
title: "EAI 수신 UPSERT SQL 생성기"
description: "컬럼 수백 개짜리 EAI 수신 인터페이스를, 사내 규칙에 맞는 PostgreSQL UPSERT 문으로 실수 없이 찍어 주는 스크립트"
date: 2026-11-17
repo: "https://github.com/wyszkd93/CLAUDE/tree/add-metric-checkboard/eai-upsert-generator"
tech: [Python, PostgreSQL, SQL, CLI]
tags: [EAI, SQL, 자동화, PostgreSQL]
status: active
summary: "EAI 연동으로 받는 데이터를 PostgreSQL UPSERT(INSERT … ON CONFLICT DO UPDATE) 문으로 자동 생성하는 스크립트예요. 컬럼 목록(TSV)만 주면, 정해진 포맷 규칙을 그대로 지켜 수백 컬럼짜리도 한 번에 찍어 줘요."
motivation: "EAI 수신 인터페이스는 컬럼이 수십에서 수백 개까지 가는데, 이걸 손으로 UPSERT 문으로 옮기면 컬럼 하나 빠뜨리거나 콤마·들여쓰기가 틀어지기 쉬워요. 게다가 선행 콤마, 바인드 변수는 대문자, 문장 끝 세미콜론 금지, PK도 갱신 절에 포함 같은 규칙을 매번 똑같이 지켜야 하고요. 그래서 컬럼 목록만 넣으면 규칙을 그대로 지켜 SQL을 만들어 주는 생성기를 만들었어요."
features:
  - { icon: "🧾", title: "TSV 한 장으로 생성", desc: "컬럼명·PK 여부·타입만 적은 TSV를 주면 INSERT … ON CONFLICT DO UPDATE 문을 통째로 만들어요." }
  - { icon: "📐", title: "포맷 규칙 자동 준수", desc: "선행 콤마, 4칸 들여쓰기, 문장 끝 세미콜론 없음, 컬럼 소문자·바인드 변수 대문자를 그대로 지켜요." }
  - { icon: "🔑", title: "PK도 갱신 절에 포함", desc: "ON CONFLICT 키를 PK에서 뽑고, DO UPDATE SET에는 PK까지 모두 = EXCLUDED.<컬럼>으로 정렬해 넣어요." }
  - { icon: "📅", title: "날짜는 지정한 것만 변환", desc: "DATE라고 명시한 컬럼만 TO_TIMESTAMP로 감싸요. 이름이 _dt로 끝나도 임의로 날짜 취급하지 않아요." }
notes:
  - { title: "_dt를 날짜로 단정하지 않기", desc: "현장에선 _dt로 끝나도 실제 타입이 varchar인 경우가 많아, 사용자가 DATE로 지정한 컬럼만 TO_TIMESTAMP 변환하도록 했어요." }
  - { title: "세미콜론 없이 출력", desc: "EAI 툴에 문장을 등록할 때 끝에 세미콜론이 있으면 안 돼서, 생성 결과도 세미콜론 없이 끝내요." }
  - { title: "결과를 .sql 파일로 저장", desc: "SQL 안의 밑줄(_)이 마크다운 이탤릭으로 깨지는 걸 피하려고, 콘솔 출력 대신 .sql 파일로 떨어뜨려요." }
---

## 써 보기

컬럼 목록 TSV (`name` / `pk`(Y·N) / `type`(DATE만 표시))를 준비하고 실행해요.

```bash
python generate_upsert.py \
  --table public.eai_recv_sample \
  --input examples/sample_input.tsv \
  --out output/eai_recv_sample.sql
```

입력 예시:

```
name     pk   type
cmp_cd   Y
site_cd  Y
recv_dt  N    DATE
item_cd  N
item_nm  N
qty      N
```

생성 결과:

```sql
INSERT INTO public.eai_recv_sample (
     cmp_cd
    ,site_cd
    ,recv_dt
    ,item_cd
    ,item_nm
    ,qty
) VALUES (
     :CMP_CD
    ,:SITE_CD
    ,TO_TIMESTAMP(:RECV_DT,'YYYYMMDDHH24MISS')
    ,:ITEM_CD
    ,:ITEM_NM
    ,:QTY
) ON CONFLICT (cmp_cd, site_cd) DO UPDATE SET
     cmp_cd                     = EXCLUDED.cmp_cd
    ,site_cd                    = EXCLUDED.site_cd
    ,recv_dt                    = EXCLUDED.recv_dt
    ,item_cd                    = EXCLUDED.item_cd
    ,item_nm                    = EXCLUDED.item_nm
    ,qty                        = EXCLUDED.qty
```

예시의 컬럼명은 모두 일반화한 가짜 값이에요.
