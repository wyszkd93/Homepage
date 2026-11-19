---
title: "MySQL에서 OR을 길게 늘어놓으면 IN보다 느려지는 이유"
url: "https://www.percona.com/blog/why-mysql-or-is-slower-than-in/"
kind: blog
topic: db
date: 2026-11-20
tags: [MySQL, 쿼리튜닝, 인덱스, 성능]
comment: "같은 뜻이라 무심코 OR로 길게 이어 붙이던 조건이, 행마다 전부 다시 비교되느라 조용히 느려진다는 걸 프로파일로 짚어 줘서 반가워요. IN 한 줄로 바꾸는 것만으로 체감이 달라지는 종류의 이야기예요."
original: "Queries with OR conditions are commonly used to implement business logic. However, it might be slower than we expected."
card:
  site: Percona
---

한 줄로 말하면 "같은 컬럼을 `OR`로 길게 늘어놓으면 MySQL이 **줄마다 조건을 하나하나 다시 세는** 바람에 느려진다는 이야기"예요. `id = 1 OR id = 2 OR …` 처럼 등치 비교를 여러 개 이어 붙이면, MySQL은 이를 한 덩어리 조건으로 묶어 행마다 그 안의 비교를 전부 돌려요. 글에서는 100만 행을 훑는 쿼리의 CPU 거의 전부가 이 조건 평가에 쓰였고, 같은 뜻을 `IN (…)`으로 바꾸면 정렬된 목록으로 빠르게 걸러져 훨씬 빨라졌어요.

DBA 눈으로 보면 이렇게 챙기게 돼요.
- **긴 OR을 IN으로**: 같은 컬럼의 등치 비교가 여러 개면 `col IN (1,2,3,…)` 한 줄로 바꿔요. 옵티마이저가 목록을 정렬해 처리하고 인덱스 범위로도 이어지기 쉬워요
- **프로파일로 원인 보기**: 느린 쿼리가 행 수에 비해 오래 걸리면 실행계획과 CPU 프로파일에서 조건 평가에 시간이 몰리는지 확인해요
- **서로 다른 조건의 OR은 따로**: 컬럼이 제각각인 OR은 IN으로 못 묶으니, 경우에 따라 UNION으로 나눠 각 가지가 인덱스를 타게 하는 편이 나아요

써 보기 전에 알아둘 것도 있어요. 이 효과는 **같은 컬럼을 등치로 비교하는 OR**에서 커요. 범위나 서로 다른 컬럼이 섞인 OR은 IN으로 바꿀 수 없고, 묶더라도 인덱스가 없으면 결국 전체를 훑어요. 바꾼 뒤에는 실제 실행계획으로 인덱스를 타는지 확인하는 게 안전해요.
