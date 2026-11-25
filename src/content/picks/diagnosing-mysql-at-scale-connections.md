---
title: "대규모 MySQL의 숨은 병목 — 커넥션 폭주와 복제 파이프라인 진단"
url: "https://ushastry.blogspot.com/2026/11/diagnosing-mysql-at-scale-part-3.html"
kind: blog
topic: db
date: 2026-11-25
tags: [MySQL, 커넥션, 복제, 진단]
comment: "느린 DB를 CPU나 디스크부터 의심하다 엉뚱한 데서 헤맨 적이 있다면 반가운 글이에요. 병목이 '통신'에 있다고 보고, 오토스케일러가 만드는 커넥션 폭주와 소리 없는 복제 지연을 의심 목록에 또렷하게 올려 줘요."
original: "Database scalability is ultimately constrained by communication between client applications and server threads, observability systems and engine instrumentation, and replication streams."
card:
  site: Umesh Shastry
---

한 줄로 말하면 "CPU나 디스크가 아니라 **대화가 막혀** 느려지는 대규모 MySQL을 진단하는 글"이에요. 확장성의 진짜 한계가 클라이언트와 서버 스레드 사이, 관측 도구와 엔진 계측 사이, 그리고 복제 스트림 사이의 '통신'에 있다고 봐요. 쿠버네티스 오토스케일러나 커넥션 풀 오설정이 만드는 커넥션 폭주와, 멀티스레드 복제(MTR)의 지연을 어떻게 짚어내는지 다루는 3부작의 세 번째 글이에요. 이런 문제는 CPU·스토리지 병목과 달리 엉뚱한 2차 증상으로 나타나 속기 쉽다는 점을 짚어요.

DBA 눈으로 보면 이렇게 와닿아요.
- **커넥션 폭주 의심**: 컨테이너가 갑자기 늘거나 커넥션 풀이 한꺼번에 초기화될 때 스레드 할당이 밀리고 핸드셰이크 큐가 쌓이는 상황을, 느려짐의 원인 후보로 먼저 올려요
- **소리 없는 복제 지연**: MTR 파이프라인의 지연이 조용히 읽기 복제본을 낡게 만들어 장애 조치(failover) 대비를 깎아먹으니, 평소에 지켜볼 지표로 삼아요
- **계측이 만드는 경합**: `LOCK_status` 같은 내부 상태 계측과 잠금 경합이 되레 부하를 더하는 경우가 있어, 관측을 더 켤 때의 비용도 같이 따져요

써 보기 전에 알아둘 것도 있어요. 대규모·클라우드(쿠버네티스, 서버리스) 환경을 전제로 커넥션·네트워크·복제에 초점을 맞춘 글이에요. 구체적인 임계치나 설정은 워크로드마다 다르니 내 환경에서 재어 보고 맞춰야 하고, 운영 사례를 정리한 블로그 글이라 특정 제품이나 라이선스 이야기는 없어요.
