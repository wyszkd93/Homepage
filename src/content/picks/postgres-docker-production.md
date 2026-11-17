---
title: "운영에서 PostgreSQL을 도커로 돌릴 때 데이터를 잃지 않는 설정"
url: "https://postgr.es/p/9Cd"
kind: blog
topic: db
date: 2026-11-18
tags: [PostgreSQL, Docker, 운영, 백업]
comment: "개발에선 10초면 뜨니 다 됐다고 넘기기 쉬운데, 운영 사고는 거의 다 도커 기본값과 Postgres의 관리 방식이 어긋나서 난다는 지적이 뼈아파요. PG 18의 경로 변경은 모르고 올리면 초기화처럼 보여서 특히 조심할 부분이에요."
original: "Running PostgreSQL in Docker takes ten seconds to start in development — and about ten minutes to lose data in production if you copy a default compose.yaml snippet from a tutorial."
card:
  site: Planet PostgreSQL
---

한 줄로 말하면 "개발에선 10초면 뜨지만 **튜토리얼 compose를 그대로 운영에 쓰면** 10분 만에 데이터를 잃을 수도 있는, 도커 Postgres의 함정 정리"예요. 장애 대부분은 도커 자체가 아니라 도커 기본값이 Postgres가 메모리와 체크포인트, 파일을 다루는 방식과 부딪혀서 생긴다는 이야기예요. 기본 `/dev/shm` 64MB, 10초 뒤 강제 종료, 고정하지 않은 `:latest` 태그, 옛 데이터 경로가 대표적인 지뢰예요.

DBA 눈으로 보면 이런 게 바로 와닿아요.
- **PG 18의 경로 변경 주의**: 18부터 PGDATA가 버전별 하위 폴더로 바뀌어서, 옛 compose의 `/var/lib/postgresql/data` 볼륨을 그대로 올리면 빈 DB로 초기화된 것처럼 보일 수 있어요
- **공유 메모리와 종료 시간**: 기본 `/dev/shm` 64MB는 병렬 쿼리나 해시에 모자라니 `shm_size`를 1GB 이상으로, 체크포인트 도중 강제 종료를 막게 `stop_grace_period`를 60초로 늘려요
- **접속과 백업 기본기**: 순간 몰리는 연결은 앞단에 PgBouncer로 받고, `5432`를 `0.0.0.0`에 열어 두지 않으며, `--data-checksums`와 외부 백업을 켜 둬요

써 보기 전에 알아둘 것도 있어요. `:latest` 대신 쓰는 버전을 고정하고, 볼륨 경로는 그 PG 버전의 공식 도커 이미지 문서에 맞춰 확인해야 해요. 글의 체크리스트는 출발점이고, 실제 메모리나 풀 크기 같은 값은 장비와 워크로드에 맞춰 조정해야 해요.
