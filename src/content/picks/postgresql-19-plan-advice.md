---
title: "PostgreSQL 19, SQL은 그대로 두고 실행계획만 바로잡기 — pg_plan_advice와 pg_stash_advice"
url: "https://postgr.es/p/9Do"
kind: blog
topic: db
date: 2026-11-26
tags: [PostgreSQL, 실행계획, 플랜관리, PG19]
comment: "통계가 낡아 좋은 계획이 뒤집히는 건 Oracle이든 PostgreSQL이든 DBA의 해묵은 골칫거리인데, PG19가 드디어 'SQL은 그대로, 계획만 고정'이라는 익숙한 카드를 쥐여 줘요. Oracle SPM 베이스라인에 손이 익은 사람일수록 반가운 기능이에요."
original: "PostgreSQL 19 introduces two supplied tools, pg_plan_advice and pg_stash_advice."
card:
  site: Planet PostgreSQL
---

한 줄로 말하면 "통계가 옛말이 되면 엉뚱한 계획을 고르는 옵티마이저에게 **SQL은 그대로 둔 채 '이 계획으로 가'라는 쪽지**를 붙이는 PostgreSQL 19의 새 기능"이에요. PG19에 `pg_plan_advice`와 `pg_stash_advice` 두 도구가 들어왔어요. 앞엣것은 지금 세션에서만 특정 쿼리의 실행계획을 지정해 검증하는 용도고, 뒤엣것은 그 지정을 쿼리 ID나 역할, 데이터베이스 단위로 저장해 애플리케이션 SQL을 건드리지 않고도 모든 연결에 적용해요. 통계가 낡아 계획이 뒤집히는 사고, 이를테면 아웃박스 테이블에 90만 행이 밀렸는데 ANALYZE를 못 해 느린 정렬 계획을 고르는 상황을 막는 안전장치예요.

DBA 눈으로 보면 이렇게 와닿아요.
- **Oracle SPM 쓰던 손에 익숙**: Oracle의 SQL Plan Management 베이스라인처럼 좋은 계획을 고정해 두고, 통계가 흔들려도 그 계획을 쓰게 하는 접근을 PostgreSQL에서도 할 수 있어요
- **코드 배포 없이 급한 불 끄기**: 장애 중 특정 쿼리가 나쁜 계획으로 돌 때, SQL을 바꾸기 어려운 상황에서도 stash로 역할이나 데이터베이스에 계획을 걸어 대응해요
- **검증과 적용을 나눠서**: `pg_plan_advice`로 한 세션에서 계획을 확인한 뒤 `pg_stash_advice`로 영구 적용하니, 힌트를 애플리케이션 코드에 박지 않아 되돌리기도 쉬워요

써 보기 전에 알아둘 것도 있어요. `shared_preload_libraries`에 두 확장을 올리고 서버를 재시작해야 하며 PostgreSQL 19 전용이에요. 계획 고정은 데이터가 크게 바뀌면 되레 낡은 계획을 붙잡는 양날의 검이라, 글쓴이 말처럼 모든 쿼리를 양육권 다툼으로 만들지 말고 꼭 필요한 쿼리에만 쓰는 게 좋아요. 운영 사례를 정리한 블로그 글이라 특정 제품이나 라이선스 이야기는 없어요.
