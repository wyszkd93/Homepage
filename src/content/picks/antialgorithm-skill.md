---
title: "AI의 첫 번째·가장 뻔한 답을 일부러 비껴가게 하는 스킬 antialgorithm"
url: "https://github.com/mankidev/antialgorithm"
kind: github
topic: ai
date: 2026-11-21
tags: [에이전트스킬, 창의성, 프롬프트, ClaudeCode]
license: "MIT"
comment: "모델에게 '네가 제일 먼저 떠올린 평범한 답'을 먼저 말하게 하고 거기서 벗어나게 한다는 접근이 재밌어요. 창작물이 늘 비슷하게 수렴하던 이유를 정확히 건드려서, 네이밍이나 문구 뽑을 때 바로 써 보고 싶어져요."
original: "Agent skill that steers the model away from its first, most average pick in creative work: names, ideas, logo, posters, UI."
card:
  owner: mankidev
  name: antialgorithm
  site: GitHub
  stats: { stars: 569, forks: 34, asOf: "2026-11-20" }
---

한 줄로 말하면 "모델이 **처음 떠올린 가장 무난한 답**을 일단 말하게 한 뒤, 거기서 의도적으로 비켜서게 만드는 창작용 스킬"이에요. 이름 짓기, 스토리, 게임 아이디어, 로고, 포스터, UI처럼 정답이 하나가 아닌 작업에서, 모델이 평균값으로 수렴하는 걸 막고 프로젝트에 맞는 이유를 들어 다른 선택으로 밀어줘요. Claude Code 같은 `SKILL.md` 로더에서 붙여 쓰는 플러그인 형태예요.

DBA·개발 눈으로 보면 이렇게 써 볼 수 있어요.
- **이름 뽑기**: 테이블이나 서비스, 변수 이름을 지을 때 매번 비슷하게 나오던 후보를 흔들어, 뻔하지 않은 선택지를 같이 받아 봐요
- **예시·더미 데이터 다양화**: 데모나 테스트용 가짜 데이터를 만들 때 비슷한 패턴만 반복되지 않게, 폭을 넓혀 달라고 시킬 수 있어요
- **문구와 화면 카피**: 안내 문구나 버튼 텍스트가 전부 비슷한 톤으로 가던 걸, 몇 가지 결이 다른 안을 뽑아 비교해요

써 보기 전에 알아둘 것도 있어요. 이건 **정답이 여럿인 창작 작업**을 위한 스킬이에요. 쿼리 결과나 수치처럼 정답이 하나인 일에서는 오히려 방해가 되니 끄고 쓰는 게 맞아요. 한국어를 포함해 여러 언어 README가 있고, 라이선스는 MIT예요.
