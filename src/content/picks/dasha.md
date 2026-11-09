---
title: "에이전트 없이 PostgreSQL 클러스터 전체를 한눈에 보는 대시보드, Dasha"
url: "https://github.com/dbulashev/dasha"
kind: github
topic: db
date: 2026-11-10
tags: [PostgreSQL, 모니터링, Patroni, 복제]
license: "GPL-3.0"
comment: "주 서버에서는 안 쓰이는 인덱스가 복제본에서는 모든 조회를 받치고 있을 수 있다는 지적이 정말 현장 얘기예요. 클러스터를 한 덩어리로 보고 판단해 주는 도구가 오픈소스로 있다는 게 반가워요."
original: "PostgreSQL perfomance dashboard"
card:
  owner: dbulashev
  name: dasha
  stats: { stars: 152, forks: 7, asOf: "2026-11-10" }
---

한 줄로 말하면 "서버에 **아무것도 깔지 않는** 건강검진 센터"예요. Dasha는 PostgreSQL 여러 클러스터를 읽기 전용 계정 하나로 둘러보며, 지금 무슨 일이 일어나는지와 무엇을 고쳐야 하는지 보여 주는 오픈소스 대시보드예요. DB 서버에 에이전트나 새 확장을 깔 필요가 없고, Dasha 하나로 여러 클러스터와 복제본을 함께 봐요. 이번 1.10에서 Patroni 자동 인식, 대기 이벤트 분석, 복제 슬롯 소실 예측이 들어왔어요.

DBA 눈으로 보면 이런 점이 쓸 만해요.
- **복제 슬롯 사고 예방**: 슬롯마다 붙잡고 있는 WAL 양과 남은 여유, 그리고 지금 속도라면 몇 분 뒤에 슬롯이 끊기는지 보여 줘서, 디스크가 차기 전에 손쓸 수 있어요
- **"인덱스 지워도 되나요?" 판단**: 주 서버와 복제본의 통계를 함께 읽어서, 주 서버에서만 보고 인덱스를 지웠다가 복제본 조회가 느려지는 실수를 막아 줘요
- **대기 이벤트 한 화면**: 활성 세션을 CPU, IO, Lock 같은 대기 종류별로 그려 주고, 문제 쿼리를 누르면 락 트리까지 이어져서 Oracle의 ASH 화면처럼 쓸 수 있어요

써 보기 전에 알아둘 것도 있어요. Patroni 정보는 etcd v3나 Consul에서 읽기만 하고, 대기 분석과 COPY 진행률은 PostgreSQL 14 이상에서만 돼요. Oracle이나 MySQL은 지원하지 않아요. 라이선스가 GPL-3.0이라 사내에서 고쳐 쓰는 건 괜찮지만, 고친 버전을 밖으로 배포할 때는 소스 공개 의무를 확인해야 해요.
