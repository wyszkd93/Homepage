---
title: "개념을 '움직이는 기계 그림'으로 만들어 설명해 주는 Claude 스킬, Anatomy"
url: "https://github.com/wheresryan22/anatomy"
kind: github
date: 2026-11-03
tags: [Claude Code, 스킬, 시각화, SVG]
license: "MIT"
comment: "설명하려는 개념을 '그 원리대로 돌아가는 물건'으로 바꿔 그린다는 발상이 신선해요. DB 커넥션 풀을 대기열 있는 기계로, 캐시 히트·미스를 자물쇠로 그려 두면 신입 교육 자료나 블로그 글 그림으로 딱이에요. 대신 한 장 만드는 데 시간이 꽤 걸리는 건 감안해야 해요."
original: "A Claude skill that explains an idea by building it as a real, working object."
card:
  owner: wheresryan22
  name: anatomy
  image: "/images/picks/anatomy-raptor.webp"
---

**Anatomy**는 기술 개념을 설명하는 그림을 "그 개념대로 실제로 움직이는 물건"으로 만들어 주는 Claude Code 스킬이에요. 예를 들어 "바뀐 게 없으면 작업을 건너뛰는 캐시 키"는 모든 핀이 맞아야만 돌아가는 자물쇠로, "GPU 하나가 여러 캔버스를 그리는 구조"는 헤드 하나가 여러 칸을 오가는 플로터로 그려요. 결과물은 아이소메트릭(비스듬히 내려다본) 그림 안에 작은 부품 수십 개가 들어 있고, 마우스와 키보드에 반응해 움직이며, 화면의 숫자도 같은 모델에서 계산돼요.

그림은 세 가지 방식으로 나와요. 기본인 **SVG**(HTML 한 장, `.svg` 파일, React 컴포넌트), 불꽃·물결·빛처럼 선으로 못 그리는 걸 셰이더로 더하는 **SVG + WebGL**, 부품이 실제로 회전하는 **3D**(베타)예요. 밝은 테마와 어두운 테마를 고를 수 있고, 다 만든 뒤에는 부품끼리 겹치지 않는지, 이음새가 제대로 붙었는지 스스로 확대해 검사해요.

설치는 `npx skills add wheresryan22/anatomy -g` 한 줄이고, `/anatomy 토큰 버킷 레이트 리미터가 어떻게 동작하는지 설명해 줘, 인터랙티브로`처럼 쓰면 돼요. Node.js 20.10 이상과 검사용 Chrome이 필요하고, 의존성은 없어요. 차트 라이브러리가 아니라 데이터 그래프는 못 그리고, 사람이나 지도보다는 기계·도구 위주예요. 공들여 만드는 방식이라 그림 한 장에 몇 분에서 수십 분이 걸려요.

> 위 그림: 저장소 예시 `examples/raptor-engine` (© 2026 Ryan, MIT License)
