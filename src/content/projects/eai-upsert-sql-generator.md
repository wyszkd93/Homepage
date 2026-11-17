---
title: "EAI 송수신 SQL 생성기"
description: "컬럼·PK·타입만 주면, 이기종 DB(PostgreSQL·Oracle·MySQL)의 송신(SELECT)·수신(UPSERT) SQL을 자동 생성하는 스크립트"
date: 2026-11-17
repo: "https://github.com/wyszkd93/CLAUDE/tree/add-metric-checkboard/eai-upsert-generator"
tech: [Python, PostgreSQL, Oracle, MySQL, SQL, CLI]
tags: [EAI, SQL, 자동화, 이기종DB]
status: done
summary: "EAI 인터페이스의 송신(SELECT)·수신(UPSERT) SQL을, 컬럼 목록 한 장(name·pk·type)만으로 DB 종류별로 자동 생성해요. 컬럼이 수백 개여도 DB 방언·날짜 변환·UPSERT 방식의 차이를 스크립트가 알아서 맞춰요."
motivation: "EAI 수신 인터페이스는 컬럼이 수십에서 수백 개까지 가서, 손으로 SQL을 옮기면 컬럼을 빠뜨리거나 콤마·들여쓰기가 틀어지기 쉬워요. 게다가 같은 UPSERT라도 PostgreSQL은 ON CONFLICT, Oracle은 UPDATE 후 없으면 INSERT 하는 블록, MySQL은 ON DUPLICATE KEY로 방식이 다르고 날짜 변환 함수까지 DB마다 달라요. 그래서 컬럼 목록만 주면 DB별로 맞는 송신·수신 SQL을 찍어 주는 생성기를 만들었어요."
features:
  - { icon: "🧾", title: "TSV 한 장으로 생성", desc: "컬럼명·PK 여부·타입만 적은 TSV를 주면 SQL을 통째로 만들어요. 수백 컬럼도 한 번에." }
  - { icon: "🗃️", title: "이기종 DB 지원", desc: "PostgreSQL은 ON CONFLICT, Oracle은 UPDATE·없으면 INSERT 블록, MySQL은 ON DUPLICATE KEY로 DB에 맞게 생성해요." }
  - { icon: "🔄", title: "송신·수신 둘 다", desc: "recv는 적재용 UPSERT, send는 추출용 SELECT. 한 입력으로 양방향 인터페이스를 다 만들어요." }
  - { icon: "📅", title: "날짜 변환 자동", desc: "DATE로 지정한 컬럼만, 수신은 문자→날짜(TO_DATE 등) 송신은 날짜→문자(TO_CHAR 등)로 DB별 함수를 붙여요." }
notes:
  - { title: "DB마다 다른 UPSERT를 한 입력으로", desc: "ON CONFLICT(PG) · UPDATE 후 IF SQL%NOTFOUND INSERT(Oracle) · ON DUPLICATE KEY UPDATE(MySQL)를 같은 컬럼 목록에서 갈라 만들어요." }
  - { title: "_dt를 날짜로 단정하지 않기", desc: "이름이 _dt로 끝나도 실제 타입이 varchar인 경우가 많아, 사용자가 DATE로 지정한 컬럼만 날짜 변환해요." }
  - { title: "값·업무 규칙은 빼고 구조만", desc: "처리 플래그 같은 업무 값은 넣지 않고 컬럼 구조로 SQL 틀만 만들어, 어느 인터페이스에나 재사용돼요." }
---

## 써 보기

컬럼 목록 TSV(`name` / `pk`(Y·N) / `type`(DATE만 표시))를 주고, `--db`와 `--mode`만 바꾸면 돼요.

```bash
# 수신(UPSERT) — DB별
python generate_sql.py --db postgres --mode recv --table public.eai_sample --input examples/sample_input.tsv --out output/recv_postgres.sql
python generate_sql.py --db oracle   --mode recv --table IF_SAMPLE         --input examples/sample_input.tsv --out output/recv_oracle.sql
python generate_sql.py --db mysql    --mode recv --table eai_sample        --input examples/sample_input.tsv --out output/recv_mysql.sql

# 송신(SELECT)
python generate_sql.py --db oracle   --mode send --table IF_SAMPLE         --input examples/sample_input.tsv --out output/send_oracle.sql
```

같은 입력에서 **Oracle 수신**은 이런 블록이 나와요:

```sql
BEGIN
  UPDATE IF_SAMPLE SET
       RECV_DT = TO_DATE(:RECV_DT,'YYYYMMDDHH24MISS')
      ,ITEM_CD = :ITEM_CD
      ,ITEM_NM = :ITEM_NM
      ,QTY = :QTY
   WHERE CMP_CD = :CMP_CD AND SITE_CD = :SITE_CD;

  IF SQL%NOTFOUND THEN
    INSERT INTO IF_SAMPLE (
         CMP_CD
        ,SITE_CD
        ,RECV_DT
        ,ITEM_CD
        ,ITEM_NM
        ,QTY
    ) VALUES (
         :CMP_CD
        ,:SITE_CD
        ,TO_DATE(:RECV_DT,'YYYYMMDDHH24MISS')
        ,:ITEM_CD
        ,:ITEM_NM
        ,:QTY
    );
  END IF;
END;
```

**송신(SELECT)**은 DATE를 전송용 문자열로 바꿔 내보내요:

```sql
SELECT
     CMP_CD
    ,SITE_CD
    ,TO_CHAR(RECV_DT,'YYYYMMDDHH24MISS') AS RECV_DT
    ,ITEM_CD
    ,ITEM_NM
    ,QTY
FROM IF_SAMPLE
```

예시의 테이블·컬럼명은 모두 일반화한 가짜 값이에요.
