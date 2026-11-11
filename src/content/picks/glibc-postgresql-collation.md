---
title: "OS만 올렸을 뿐인데 데이터가 깨진다, glibc와 PostgreSQL 정렬 순서 이야기"
url: "https://www.percona.com/blog/ten-ways-a-glibc-change-can-break-your-postgresql-cluster/"
kind: blog
topic: db
date: 2026-11-12
tags: [PostgreSQL, 정렬, OS 업그레이드, 인덱스]
comment: "DB 버전은 그대로인데 OS만 올렸다가 인덱스가 조용히 틀어지는 일은 정말 무서운 사고예요. '재인덱싱만 하면 된다'는 통념이 전부가 아니라는 걸 조목조목 보여 주는 글이에요."
original: "Between any two glibc versions, locales can change, and those changes alter the order of character string comparison."
card:
  site: "Percona 블로그"
---

한 줄로 말하면 "**자 눈금이 바뀐 줄 모르고** 재니까 길이가 달라진 격"이에요. PostgreSQL은 문자열 비교 순서를 OS의 glibc 로케일에 맡기는데, RHEL7→8이나 8→9처럼 OS를 올리면 glibc가 바뀌면서 같은 글자들의 정렬 순서가 달라져요. 그러면 그 순서를 믿고 만들어 둔 인덱스가 실제 데이터와 어긋나, 조회 결과가 빠지거나 제약이 깨질 수 있어요. 이 글은 그렇게 데이터가 깨지는 경우 10가지를 실제 두 노드(Rocky 8.9 → 9.3)로 재현해 정리했어요.

DBA 눈으로 보면 이런 점을 챙겨야 해요.
- **OS 업그레이드 = DB 작업**: DB 버전을 안 바꿔도 OS만 올리면 정렬이 바뀔 수 있으니, OS 패치나 서버 교체 계획에 반드시 정렬 영향 점검을 넣어야 해요
- **복제본 승격 때 특히 위험**: 구 OS 주 서버와 신 OS 복제본을 쓰다가 복제본을 승격하면, 겉보기엔 멀쩡해도 인덱스 순서가 틀어진 채로 운영이 시작될 수 있어요
- **재인덱싱만으로는 부족**: 흔히 "재인덱싱하면 된다"고 하지만, 이 글은 그것만으로 남는 문제들이 있다고 지적해요. B-tree 인덱스뿐 아니라 제약, 파티션 등 영향 범위를 함께 봐야 해요

써 보기 전에 알아둘 것도 있어요. 글쓴이가 두 glibc 버전 사이의 로케일 변화를 찾아 주는 도구(`pg-glibc-collation-audit`)를 만들어 함께 공개했어요. 모든 로케일이 바뀌는 건 아니고 영향받는 로케일만 문제가 되니, 우리 DB가 쓰는 로케일이 대상인지 먼저 확인하는 게 첫걸음이에요. `COLLATE "C"`처럼 바이트 순서를 쓰는 컬럼은 glibc 영향을 받지 않아요.
