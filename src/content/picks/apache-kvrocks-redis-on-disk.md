---
title: "레디스를 디스크 위로 옮겨 메모리 비용을 줄이는 Apache Kvrocks"
url: "https://github.com/apache/kvrocks"
kind: github
topic: db
date: 2026-11-16
tags: [Redis, RocksDB, 캐시, 메모리비용]
license: "Apache-2.0"
comment: "데이터가 테라바이트급으로 커지면 질문이 '얼마나 빠른가'에서 '서버 몇 대에 메모리 얼마나'로 바뀌어요. 레디스 클라이언트는 그대로 두고 저장소만 디스크로 내리는 선택지를 준다는 점이 비용 회의에서 꺼내 볼 만해요."
original: "Apache Kvrocks is a distributed key value NoSQL database that uses RocksDB as storage engine and is compatible with Redis protocol."
card:
  owner: apache
  name: kvrocks
  site: GitHub
  stats: { stars: 4504, forks: 687, asOf: "2026-11-16" }
---

한 줄로 말하면 "자주 쓰는 책만 책상에 두고 나머지는 **책장에 꽂아 두는** 서재"예요. 레디스(Redis)는 모든 데이터를 메모리에 올려 빠르지만, 데이터가 커질수록 그만큼 비싼 RAM이 필요해요. Kvrocks는 저장 엔진으로 RocksDB를 써서 데이터를 디스크에 두고, 레디스 프로토콜(RESP)은 그대로 흉내 내요. 그래서 기존 레디스 클라이언트로 접속해 쓰던 명령을 거의 그대로 쓰면서, 메모리보다 큰 데이터를 담을 수 있어요. 아파치 소프트웨어 재단(ASF) 정식 프로젝트예요.

DBA·운영 눈으로 보면 이런 점이 눈에 들어와요.
- **메모리 비용이 부담되는 캐시·세션**: 수십에서 수백 기가의 세션이나 캐시를 레디스로 전부 RAM에 올려 서버를 늘리던 자리를, 디스크 기반으로 바꿔 장비 대수와 메모리 비용을 줄일 수 있어요
- **애플리케이션을 안 고치고 교체**: 드라이버와 코드를 그대로 두고 접속만 바꿔 넘어갈 수 있고, 네임스페이스로 한 서버를 여러 용도로 나눠 쓰는 구성도 돼요
- **익숙한 방식의 이중화**: MySQL처럼 binlog로 비동기 복제를 하고 Sentinel로 페일오버, 클러스터 모드까지 지원해서, 기존 MySQL·레디스 운영 감각으로 HA를 꾸릴 수 있어요

써 보기 전에 알아둘 것도 있어요. 디스크를 거치니 응답 지연은 순수 인메모리 레디스보다 커요 — 마이크로초를 다투는 워크로드보다, 용량이 크고 비용에 민감한 캐시·큐·세션 쪽에 맞아요. 설치는 소스 빌드(cmake와 `./x.py build`)나 공식 바이너리·도커로 하고, RocksDB를 다뤄 본 경험이 튜닝에 도움이 돼요. 레디스 명령을 전부 지원하는 건 아니라서, 쓰는 명령이 되는지는 미리 확인해야 해요. 라이선스는 Apache 2.0이에요.
