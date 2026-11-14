---
title: "멀쩡하던 Aurora MySQL이 어느 날 인덱스를 못 만들게 되는 오류 63955"
url: "https://aws.amazon.com/blogs/database/fix-amazon-aurora-mysql-error-63955-virtual-index-id-overflow/"
kind: blog
topic: db
date: 2026-11-15
tags: [MySQL, Aurora, 인덱스, 생성 컬럼]
comment: "지표가 전부 초록인데 어느 순간 인덱스를 못 만든다는 상황은 생각만 해도 아찔해요. 내부 ID가 소리 없이 소진되는 종류의 한계라, 미리 경보를 걸어 두는 게 유일한 대비라는 점이 오래 남아요."
original: "Your Amazon Aurora MySQL cluster looks healthy. Reads and writes succeed and every metric is green. Then a routine CREATE INDEX fails with error 63955."
card:
  site: "AWS Database Blog"
---

한 줄로 말하면 "**번호표가 동나서** 더는 새 손님을 못 받는" 상황이에요. Aurora MySQL은 가상 컬럼이 들어간 인덱스를 다룰 때마다 내부 식별자(가상 인덱스 ID)를 하나씩 써요. DDL을 오래 돌리다 이 번호(약 43억 개)가 바닥나면, 어느 날 `CREATE INDEX`가 오류 63955를 내고, 그 뒤로는 가상 생성 컬럼·함수 기반·다중 값 인덱스를 아무것도 못 만들게 돼요. 기존 데이터와 보통 인덱스는 멀쩡하고, 지표도 전부 초록이라 더 당황스러워요.

DBA 눈으로 보면 이렇게 대비할 만해요.
- **조용히 차는 한계는 경보로**: Aurora MySQL 3.10.0 이상에서는 에러 로그에 `VIRTUAL_INDEX_ID_OVERFLOW_WARNING`이 뜨니, 여기에 알람을 걸어 두는 게 사실상 유일한 사전 대비예요
- **급할 때 임시 처방**: 문제 인덱스의 생성 컬럼을 `VIRTUAL`에서 `STORED`로 바꾸면 그 인덱스는 만들어지지만, ID가 초기화되는 건 아니라 다른 가상 컬럼 인덱스는 여전히 실패해요
- **근본 해결은 재적재**: 논리 덤프 후 새 클러스터로 복원하면 ID가 리셋돼요. 전환 시간을 줄이려면 바이너리 로그 복제로 따라붙여 두는 게 좋아요

써 보기 전에 알아둘 것도 있어요. 이 한계는 가상 컬럼을 쓰는 인덱스를 자주 만들고 지우는 환경에서 천천히 다가와요. `STORED`로 바꾸면 저장 공간을 더 쓰는 대신 인덱스에 가상 컬럼이 안 들어가니, 당장 급한 인덱스만 임시로 넘기는 용도로 보면 돼요. 평소 DDL이 많다면 지금 경보부터 걸어 두는 걸 권해요.
