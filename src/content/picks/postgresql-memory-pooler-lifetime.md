---
title: "서버를 키우는 대신 연결을 10분마다 갈아 메모리를 반으로, PostgreSQL 비용 절감"
url: "https://cortexridge.com/blog/reduce-postgresql-memory-usage-cloud-bill/"
kind: blog
topic: db
date: 2026-11-15
tags: [PostgreSQL, 메모리, 커넥션 풀, PgBouncer]
comment: "메모리 경보에 서버부터 키우려던 손을 멈추게 하는 글이에요. 원인이 설정 한 줄에 있었다는 결말이, 비슷한 상황에서 무턱대고 사양을 올리던 습관을 돌아보게 해요."
original: "Most teams answer a memory alert with a bigger server. We cut this one in half, and the cloud bill went from $630 to $320 a month."
card:
  site: "CortexRidge"
---

한 줄로 말하면 "오래 앉은 손님이 **짐을 잔뜩 쌓아** 자리를 다 차지한 상황"이에요. 테넌트마다 스키마를 따로 두어 테이블이 8만 개가 넘는 PostgreSQL에서, 하루 종일 메모리 경보가 울렸어요. 보통은 서버를 키우지만, 이 팀은 반대로 메모리를 반으로 줄이고도 경보를 없앴고 클라우드 비용이 월 $630에서 $320로 내려갔어요. 범인은 연결마다 쌓이는 카탈로그 캐시였어요.

DBA 눈으로 보면 이렇게 와닿아요.
- **연결이 들고 있는 캐시**: PostgreSQL은 연결이 건드린 테이블 정보를 연결이 닫힐 때까지 캐시로 들고 있어요. 테이블이 수백 개면 문제없지만, 8만 개에 커넥션 풀이 연결을 24시간 유지하니 연결마다 하루치 캐시를 짊어졌어요
- **해법은 연결 재활용**: 풀이 연결을 10분마다 폐기하고 새로 열게 하면 캐시가 안 쌓여요. PgBouncer면 `server_lifetime = 600`(기본 3600)이고, 트랜잭션 풀링에서 특히 잘 맞아요. Oracle에서 세션마다 딕셔너리 캐시가 쌓여 PGA가 부풀 때 세션을 주기적으로 재활용하는 발상과 닮았어요
- **직접 재 보기**: `pg_backend_memory_contexts`에서 `CacheMemoryContext` 크기를 보면 내 세션이 든 캐시를 알 수 있어요(PostgreSQL 14 이상). 새 세션에서 테이블 수백 개를 조회한 전후를 비교하면 커지는 게 보여요

써 보기 전에 알아둘 것도 있어요. 이 방법이 효과적인 건 "테넌트마다 스키마"처럼 테이블이 아주 많은 환경이에요. 테이블이 적으면 캐시가 작아 체감이 없어요. 연결을 자주 재활용하면 10분에 한 번 재접속이 생기는데, 쓰지 않는 연결만 닫으므로 보통은 티가 안 나요. 결과는 연결 수명 24시간→10분, 메모리 93%→50%였어요.
