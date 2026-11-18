---
title: "로컬 LLM 서버 속도를 한 번에 하나씩 끌어올리는 스킬 inference-optimisation"
url: "https://github.com/sybil-solutions/inference-optimisation-skill"
kind: github
topic: ai
date: 2026-11-19
tags: [로컬LLM, 추론최적화, 성능튜닝, 스킬]
license: "MIT"
comment: "플래그 목록이 아니라 '측정하고 한 번에 하나만 바꾼다'는 튜닝 방법론을 그대로 담았다는 점이 반가워요. 실패한 시도까지 로그로 남기라는 규칙이 운영에서 변경 이력을 남기는 습관과 똑 닮았어요."
original: "Agent skill for hill-climbing local LLM serving speed (decode, speculative decoding, prefill, KV, startup, TTFT) on any hardware and quantization."
card:
  owner: sybil-solutions
  name: inference-optimisation-skill
  site: GitHub
  stats: { stars: 1091, forks: 98, asOf: "2026-11-18" }
---

한 줄로 말하면 "로컬에서 돌리는 LLM 서버를 **눈금을 보며 조금씩 조이는** 튜닝 안내서"예요. 디코딩 속도, 추측 디코딩, 프리필, KV 캐시 크기, 기동 시간과 첫 토큰까지 나오는 시간을 대상으로, 먼저 이론상 최대치를 계산하고 한 번에 하나만 바꿔 측정한 뒤, 긴 문맥에서도 결과가 안정적일 때만 받아들이는 순서를 정해 둔 스킬이에요. 특정 플래그 모음이 아니라 "어떻게 측정하며 올렸는지"를 담았어요.

DBA·운영 눈으로 보면 이렇게 와닿아요.
- **측정 없이 바꾸지 않기**: 운영 튜닝처럼 한 번에 하나만 바꾸고 통제군과 비교해, 무엇이 실제로 효과를 냈는지 가려내요
- **자원 한도 안에서 올리기**: 메모리 상한을 걸어 둔 채 KV 캐시나 동시 사용자 수를 늘려서, 장비가 감당하는 범위 안에서 처리량을 키워요
- **실패까지 기록하기**: 바꾼 값과 결과를 전부 로그로 남겨, 나중에 재현하거나 성능이 되돌아갔을 때 원인을 되짚을 수 있어요

써 보기 전에 알아둘 것도 있어요. Claude Code처럼 `SKILL.md`를 읽는 에이전트에서 동작하고, `PROMPT.md`로 다른 모델도 따라 할 수 있어요. README의 속도 수치는 특정 하드웨어와 양자화, 엔진(SGLang 등) 기준이라 환경마다 달라지니 그대로 기대하기보다 자기 장비에서 재 봐야 해요. 로컬 LLM 서버를 직접 운영하는 사람에게 맞고, 라이선스는 MIT예요.
