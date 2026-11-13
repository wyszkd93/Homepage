---
title: "할 수 있다고 해야 하는 건 아니에요, Galera 노드 가중치 다시 보기"
url: "https://www.percona.com/blog/just-because-you-can-doesnt-mean-you-should-re-evaluating-galera-node-weights/"
kind: blog
topic: db
date: 2026-11-14
tags: [MySQL, Galera, 클러스터, 쿼럼]
comment: "'짝수 노드도 가중치 주면 되지 않나'라는 솔깃한 생각을, 쿼럼이 실제로 어떻게 계산되는지로 차근차근 눌러 주는 글이에요. 되는 것과 해도 되는 것은 다르다는 제목이 운영자의 경험을 그대로 담았어요."
original: "We all know that when using a cluster based on Galera (Codership) such as Percona XtraDB Cluster (PXC), it is recommended to deploy an odd number of nodes."
card:
  site: "Percona 블로그"
  image: "https://www.percona.com/wp-content/uploads/2026/11/goat_small.jpg"
---

한 줄로 말하면 "**다수결 표 계산**을 이해하고 나면 짝수 노드가 왜 위험한지 보인다"는 이야기예요. Galera 기반 클러스터(Percona XtraDB Cluster 등)는 노드를 홀수로 두라고 권하는데, `pc.weight`로 노드마다 표의 무게를 다르게 줄 수 있으니 "짝수로 두고 가중치를 조절하면 되지 않나" 싶어져요. 할 수는 있지만, 누구에게 얼마를 줄지 정하기가 어렵다는 걸 쿼럼 계산 원리로 풀어낸 글이에요.

DBA 눈으로 보면 이런 점을 챙길 만해요.
- **스플릿 브레인의 작동 방식**: 네트워크가 갈라지면 다수 표를 못 가진 쪽은 스스로 쓰기를 멈춰서 데이터가 깨지는 걸 막아요. 이게 '안전한 멈춤'이라는 걸 이해해야 가중치 장난의 위험이 보여요
- **절대 켜지 말 설정**: `pc.ignore_sb = yes`는 스플릿 브레인을 무시하고 양쪽 다 쓰기를 받아, 밤새 데이터 맞추게 만드는 원흉이에요. 있으면 지금 빼라고 못 박아요
- **View와 Primary Component**: 지금 서로 연결된 노드 집합(View)과, 그중 다수를 쥐어 쓰기를 받는 쪽(Primary Component) 개념을 알아야 장애 로그를 읽을 수 있어요

써 보기 전에 알아둘 것도 있어요. 2노드에 가중치를 몰아주면 그 노드가 죽을 때 남은 쪽이 다수를 잃어 클러스터가 멈추는 식으로, 가중치 설계는 장애 시나리오마다 결과가 달라져요. 지역을 나눠 배치하는 경우엔 더 복잡해지니, 글이 안내하는 쿼럼 계산을 먼저 손으로 따라가 보는 게 안전해요.
