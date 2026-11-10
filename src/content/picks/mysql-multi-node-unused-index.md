---
title: "주 서버에서 안 쓰이는 인덱스, 지우기 전에 복제본까지 확인해 주는 MySQL 스크립트"
url: "https://www.percona.com/blog/multi-node-unused-index-verification/"
kind: blog
topic: db
date: 2026-11-10
tags: [MySQL, 인덱스, 복제, Percona]
comment: "'안 쓰는 인덱스 목록'을 그대로 DROP 문으로 바꿨다가 리포트 서버가 멈추는 사고는 생각보다 흔해요. 지우기 전에 한 번 더 묻는 습관을 도구로 만들어 둔 글이에요."
original: "Every MySQL schema that’s been around for a few years collects indexes nobody remembers adding."
card:
  site: "Percona 블로그"
  image: "https://www.percona.com/wp-content/uploads/2026/11/Screenshot-2026-11-01-at-10.30.27-AM.png"
---

한 줄로 말하면 "가족 **모두에게** 물어보고 나서야 버리는 물건 정리"예요. MySQL의 `sys.schema_unused_indexes`는 그 서버에서 읽히지 않은 인덱스만 알려 줘요. 그런데 무거운 조회는 복제본에서 도는 경우가 많아서, 주 서버 기준으로 지운 인덱스가 복제본의 리포트 쿼리를 풀 스캔으로 떨어뜨릴 수 있어요. Percona가 공개한 `check_unused_indexes`는 복제 구성 전체를 찾아가 모든 서버에서 안 쓰인 인덱스만 골라 줘요.

DBA 눈으로 보면 이렇게 써 볼 수 있어요.
- **인덱스 정리 작업 전 확인**: 주 서버에서 뽑은 후보를 모든 복제본, Galera 노드, Aurora 리더와 교집합해서, 정말 아무도 안 쓰는 인덱스만 DROP 대상으로 남겨요
- **재기동 직후 착시 피하기**: 성능 통계는 재기동하면 초기화돼서, 월말 배치나 분기 리포트가 아직 안 돈 서버에서는 멀쩡한 인덱스도 안 쓰는 것처럼 보여요. 노드마다 가동 시간을 확인하는 이유예요
- **FK 인덱스는 자동 제외**: 외래 키가 기대는 인덱스는 처음부터 후보에서 빼 줘서, 지웠다가 제약 오류가 나는 일을 막아 줘요

써 보기 전에 알아둘 것도 있어요. Python 3.6 이상과 `pymysql` 하나만 있으면 되고, 모든 노드에 같은 읽기 전용 계정이 필요해요. 서버에는 아무것도 바꾸지 않고, 한 노드라도 답을 못 받으면 목록을 내지 않고 멈춰요. 복제본의 `Source_Host`와 인벤토리에 적은 주소가 글자 그대로 같아야 구성을 제대로 찾으니, 호스트 이름과 IP를 섞어 쓰지 않도록 주의해야 해요. 스크립트는 GitHub의 Percona-Lab/check_unused_indexes에 있어요.
