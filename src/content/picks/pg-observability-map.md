---
title: "PostgreSQL 통계 뷰를 구조도 위에 펼쳐 놓은 지도, PG Observability Map"
url: "https://github.com/meob/pg-observability-map"
kind: github
topic: db
date: 2026-11-10
tags: [PostgreSQL, 통계 뷰, 학습 자료]
license: "Apache-2.0"
comment: "Oracle DBA가 PostgreSQL을 처음 맡았을 때 가장 막막한 게 'V$ 뷰 대신 뭘 봐야 하지'인데, 그 답을 그림으로 찾게 해 주는 도구예요. 북마크해 두고 필요할 때 꺼내 보기 좋아요."
original: "An interactive map of PostgreSQL internals, system statistics, views and functions, with version-aware navigation."
card:
  owner: meob
  name: pg-observability-map
  stats: { stars: 3, forks: 0, asOf: "2026-11-10" }
---

한 줄로 말하면 "PostgreSQL 진단 뷰의 **지하철 노선도**"예요. pg_stat_activity, pg_stat_io 같은 시스템 뷰와 함수, 통계를 PostgreSQL 내부 구조 그림 위에 배치해서, 어떤 뷰가 어느 부분(공유 메모리, WAL, 백그라운드 프로세스 등)을 보여 주는지 눌러 가며 찾게 해 주는 웹 도구예요. 버전을 고르면 그 버전에 있는 뷰만 보여 주고, PostgreSQL 19까지 다뤄요.

DBA 눈으로 보면 이렇게 써 볼 수 있어요.
- **Oracle에서 넘어온 DBA의 안내도**: V$SESSION, V$SYSSTAT에 익숙한 사람이 PostgreSQL에서 대응되는 뷰를 구조 그림으로 찾아갈 수 있어요
- **장애 때 "어디를 봐야 하지"**: WAL이 쌓인다, 체크포인트가 잦다 같은 증상이 있을 때 해당 구성 요소를 눌러 볼 뷰를 바로 찾을 수 있어요
- **버전 업그레이드 확인**: 버전을 바꿔 보며 새로 생긴 뷰와 사라진 뷰를 비교해, 업그레이드 뒤 점검 쿼리를 고칠 곳을 미리 알 수 있어요

써 보기 전에 알아둘 것도 있어요. 설치 없이 웹 데모 페이지에서 바로 볼 수 있고, DB에 접속하는 도구는 아니라서 실제 값을 보여 주지는 않아요. 방금 1.0을 낸 작은 프로젝트라 별이 아직 몇 개뿐이에요. PostgreSQL 공식 뉴스에 소개돼서 골랐어요. 라이선스는 Apache 2.0이에요.
