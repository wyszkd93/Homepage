---
title: "개념을 '움직이는 기계 그림'으로 만들어 설명해 주는 Claude 스킬, Anatomy"
url: "https://github.com/wheresryan22/anatomy"
kind: github
date: 2026-11-03
tags: [Claude Code, 스킬, 시각화, SVG]
license: "MIT"
comment: "개념 설명은 결국 '머릿속 그림'을 옮기는 일인데, 그걸 아예 손으로 만져 보게 해 준다는 게 이 스킬의 매력이에요. 운영 문서나 장애 회고에 한 장씩 넣어 두면 오래 기억에 남을 것 같아요."
original: "A Claude skill that explains an idea by building it as a real, working object."
card:
  owner: wheresryan22
  name: anatomy
  image: "/images/picks/anatomy-raptor.webp"
---

한 줄로 말하면 "설명을 그림 대신 **장난감**으로 해 주는 스킬"이에요. 개념을 화살표 다이어그램으로 그리는 게 아니라, 그 개념대로 실제로 돌아가는 작은 기계를 만들어 줘요. 위 로켓 엔진처럼 부품 하나하나가 살아 있는 비스듬한 그림이 나오고, 누르고 돌려 보며 동작을 확인할 수 있어요.

DBA 눈으로 보면 쓸 데가 꽤 떠올라요.
- **커넥션 풀**: 손님(세션)이 줄 서 있다가 빈 창구(커넥션)가 나면 들어가는 매표소
- **Redo 로그 스위치**: 두세 개 통에 번갈아 물을 채우고, 찬 통은 아카이브로 옮겨 붓는 물레방아
- **래치 경합**: 문 하나에 여러 사람이 몰려 손잡이를 잡으려고 다투는 장면

글로 열 줄 쓰는 것보다 이런 그림 한 장이 신입 교육이나 블로그 글에서 훨씬 잘 먹혀요.

써 보기 전에 알아둘 것도 있어요. 설치는 `npx skills add wheresryan22/anatomy -g`, 사용은 `/anatomy 커넥션 풀 동작 설명해 줘` 식이에요. Node.js 20.10 이상이 필요하고, 공들여 그리는 만큼 한 장에 몇 분~수십 분 걸려요. 숫자 차트를 그리는 도구는 아니라서, AWR 추이 같은 그래프는 다른 도구로 그려야 해요.

> 위 그림: 저장소 예시 `examples/raptor-engine` (© 2026 Ryan, MIT License)
