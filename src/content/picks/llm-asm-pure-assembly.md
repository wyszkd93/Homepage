---
title: "순수 어셈블리로 짠 LLM — 의존성 0으로 Qwen3를 돌리는 llm.asm"
url: "https://github.com/alesha-pro/llm.asm"
kind: github
topic: ai
date: 2026-11-27
tags: [로컬LLM, 어셈블리, 추론최적화, 제로디펜던시]
license: "MIT"
comment: "요즘 '러스트로 다시 짜라'는 흐름과 정반대로, 아예 어셈블리까지 내려가 llama.cpp보다 빠른 결과를 낸 게 통쾌해요. 실무에 바로 쓸 물건이라기보다, 로컬 추론이 실제로 얼마나 가볍게 가능한지 보여 주는 자극제예요."
original: "Qwen3-0.6B inference (12 KB), bare-metal bootable OS (22 KB), and from-scratch Mini-GPT trainer in 100% pure x86-64 NASM assembly."
card:
  owner: alesha-pro
  name: llm.asm
  stats: { stars: 2158, forks: 327, asOf: "2026-11-27" }
---

한 줄로 말하면 "C도 libc도 없이 **맨손으로 깎아 만든** LLM 추론기"예요. Qwen3-0.6B 추론기(14KB), 리눅스 없이 부팅해 바로 도는 베어메탈 OS(24KB), 밑바닥부터 짠 미니 GPT 학습기까지 세 가지를 전부 x86-64 어셈블리로 썼어요(17,000여 줄). 런타임도 의존성도 없이 nasm과 ld로만 빌드되는데, Q8 양자화 CPU 디코드가 llama.cpp보다 18~36% 빠르고 PyTorch와 토큰이 똑같이 나와요.

DBA·개발 눈으로 보면 이렇게 와닿아요.
- **GPU 없는 서버에서도**: CPU만으로 llama.cpp를 앞서는 속도라, 그래픽카드 없는 DB나 업무 서버에서 작은 로컬 모델을 돌리는 게 한결 현실적으로 느껴져요
- **들어 있는 게 전부 보이는 투명함**: libc도 런타임도 없어 바이너리에 무엇이 들어갔는지 완전히 드러나니, 반입 소프트웨어를 깐깐히 보는 환경에서 공급망 걱정이 줄어요
- **추론 내부를 배우는 교재**: RMSNorm이나 RoPE, GEMM, KV 캐시를 손으로 구현해 놓아, 추론이 실제로 어떻게 도는지 눈으로 좇아 볼 수 있어요

써 보기 전에 알아둘 것도 있어요. 학습용이자 실험용에 가까운 프로젝트예요. x86-64(AVX2/FMA) 전용이고, 내부를 교과서처럼 뜯어보거나 극한의 경량 추론을 실험하는 데 맞지 어떤 모델이든 서비스로 올리는 범용 런타임은 아니에요. 다루는 건 0.6B급의 작은 모델이고, 라이선스는 MIT예요.
