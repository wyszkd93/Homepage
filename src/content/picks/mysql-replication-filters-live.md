---
title: "운영 복제를 멈추지 않고 테이블을 빼고 다시 넣기 — MySQL 복제 필터 실무"
url: "https://www.percona.com/blog/a-practical-guide-to-adding-and-updating-mysql-replication-filters/"
kind: blog
topic: db
date: 2026-11-27
tags: [MySQL, 복제, 운영, mydumper]
comment: "민감 테이블 하나를 복제에서 빼겠다고 복제본을 통째로 다시 만들던 경험이 있다면 반가운 글이에요. 프라이머리는 손도 대지 않고 복제본 쪽에서만 범위를 조정하는 길을, 바이너리 로그 좌표와 함께 또렷하게 보여 줘요."
original: "Managing MySQL replication filters in a live production environment doesn’t have to mean rebuilding your replicas from scratch."
card:
  site: Percona
---

한 줄로 말하면 "복제를 통째로 다시 깔지 않고 **흐르는 물길에서 특정 지류만 막았다 텄다** 하는 방법"이에요. 운영 중인 MySQL 복제에서 특정 테이블을 복제 대상에서 빼거나, 뺐던 테이블을 다시 깨끗하게 맞춰 복제 스트림으로 되돌리는 절차를 다뤄요. 프라이머리는 건드리지 않고 복제본 쪽에서 mydumper와 바이너리 로그 좌표를 써서 하는 법을 정리한 글이에요.

DBA 눈으로 보면 이렇게 와닿아요.
- **복제 재구축 없이 범위 조정**: 민감한 테이블 하나를 복제에서 빼려고 복제본을 통째로 다시 만들던 일을, 필터 수정과 부분 재동기로 줄여요
- **프라이머리 무중단**: 프라이머리를 멈추거나 잠그지 않고 복제본에서만 작업하니, 운영 영향 없이 바꿀 수 있어요
- **좌표로 정확히 이어 붙이기**: 뺐던 테이블을 다시 넣을 때 mydumper 덤프 시점의 바이너리 로그 좌표에 맞춰 복제를 이어, 빠뜨리거나 중복되는 행 없이 맞춰요

써 보기 전에 알아둘 것도 있어요. 바이너리 로그 기반 MySQL 복제를 전제로 하고, 필터 종류(`replicate-do`, `replicate-ignore` 등)와 복제 토폴로지에 따라 주의할 점이 달라요. 부분 재동기 중에는 해당 테이블에 일관성 창이 생기니 작업 시점을 잘 잡아야 하고, 운영에 적용하기 전에 스테이징에서 좌표와 필터 동작을 확인하는 게 안전해요. Percona 블로그의 실무 가이드예요.
