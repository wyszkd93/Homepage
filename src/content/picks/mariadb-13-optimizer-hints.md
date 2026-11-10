---
title: "MySQL식 옵티마이저 힌트를 받아들이고 뷰 안까지 넓힌 MariaDB 13.0"
url: "https://mariadb.org/giving-the-optimizer-a-hint-whats-new-in-mariadb-server-13-0-compatibility-and-beyond/"
kind: blog
topic: db
date: 2026-11-11
tags: [MariaDB, 옵티마이저 힌트, 실행계획, MySQL 호환]
comment: "힌트 문법이 MySQL과 같아졌다는 건 이관 작업에서 고칠 곳이 하나 줄었다는 뜻이에요. 뷰 안에 힌트를 넣을 수 있다는 점은 Oracle에서 넘어온 사람에게 특히 반가울 거예요."
original: "Discover optimizer hints in MariaDB Server 13.0: MySQL-compatible syntax, query plan control, and advanced features for views and query blocks."
card:
  site: "MariaDB.org"
  image: "https://mariadb.org/wp-content/uploads/2026/11/optimizer_hints.png"
---

한 줄로 말하면 "옵티마이저에게 건네는 **쪽지 문법**을 MySQL과 맞춘 업데이트"예요. MariaDB 13.0에 `/*+ ... */` 형태의 새 옵티마이저 힌트가 대거 들어왔는데, 문법은 MySQL 8.0과 같아요. 조인 순서, 인덱스 사용, 조인 버퍼, 파생 테이블 병합, 서브쿼리 실행 방식, 최대 실행 시간 같은 것을 쿼리마다 지정할 수 있어요.

DBA 눈으로 보면 이렇게 써 볼 수 있어요.
- **MySQL에서 옮겨 온 쿼리 그대로 쓰기**: MySQL 8.0에서 힌트를 넣어 둔 쿼리를 MariaDB로 옮겨도 힌트를 다시 쓰지 않아도 돼서, 이관 테스트 범위가 줄어요
- **뷰 안에서 실행계획 고정**: MySQL은 뷰 정의 안에 인덱스 힌트만 넣을 수 있지만, MariaDB는 실행 시간 제한을 뺀 나머지 힌트를 모두 뷰 안에 넣을 수 있어요. Oracle에서 뷰에 힌트를 박아 두던 습관을 이어 갈 수 있어요
- **QB_NAME 없이 안쪽 블록 지정**: CTE나 서브쿼리, 뷰 안의 테이블을 경로로 바로 가리킬 수 있어서, 원본 쿼리를 고치지 않고 바깥에서 힌트를 줄 수 있어요

써 보기 전에 알아둘 것도 있어요. 13.0부터 들어온 기능이라 그 이전 버전에서는 쓸 수 없어요. 힌트는 데이터가 바뀌면 오히려 독이 될 수 있으니, 통계 정보 문제를 덮는 용도보다 꼭 필요한 쿼리에만 쓰는 게 좋아요. 전체 힌트 목록과 예시는 MariaDB 문서에 정리돼 있어요.
