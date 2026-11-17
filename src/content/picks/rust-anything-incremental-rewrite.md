---
title: "앱을 한 조각씩 Rust로 바꾸되 원래 동작과 대조해 검증하는 rust-anything"
url: "https://github.com/erkamyaman/rust-anything"
kind: github
topic: ai
date: 2026-11-18
tags: [Rust, 마이그레이션, 리라이트, 검증]
license: "MIT"
comment: "손으로 재작성할 때마다 '출력이 미묘하게 달라지는' 사고가 늘 무서웠는데, 녹화해 둔 사례와 0건 불일치일 때만 넘어간다는 설계가 든든해요. 큰 도구를 멈추지 않고 조금씩 옮길 수 있다는 점도 현실적이에요."
original: "Rewrite your whole app in Rust, one piece at a time, checked against the original's record."
card:
  owner: erkamyaman
  name: rust-anything
  site: GitHub
  stats: { stars: 1152, forks: 75, asOf: "2026-11-18" }
---

한 줄로 말하면 "옛 프로그램이 하던 일을 **녹화해 두고**, 새로 짠 Rust가 똑같이 하는지 매번 틀어 보는 이사 도우미"예요. TypeScript, 파이썬, C, Go, 루비, 자바 앱이 지금 뭘 하는지 기록해 두고, Rust로 한 조각씩 바꿀 때마다 그 기록과 대조해 결과가 같을 때만 다음으로 넘어가요. CLI와 HTTP 서버, 라이브러리를 통째로 또는 느린 부분만 골라 옮길 수 있고, Rust 코드는 코딩 에이전트나 사람이 써요.

DBA·운영 눈으로 보면 이렇게 써 볼 수 있어요.
- **느린 운영 스크립트 바꾸기**: 매일 도는 정리나 집계 배치, CLI가 느릴 때 핫패스만 Rust로 옮기고 기존 결과와 대조해 값이 틀어지지 않았는지 확인해요
- **바꿔도 똑같은지 보장**: 손으로 재작성하면 늘 출력이 미묘하게 달라지는 사고가 나는데, 녹화해 둔 사례와 어긋남이 없을 때만 통과시키니 회귀를 일찍 잡아요
- **한꺼번에 안 바꿔도 됨**: 한 조각씩 옮기는 동안에도 앱이 계속 동작해서, 큰 도구를 멈추지 않고 점진적으로 전환해요

써 보기 전에 알아둘 것도 있어요. 검증은 **녹화한 사례만** 보장해요. 기록에 없던 입력이나 엣지 케이스는 못 잡으니, 실제로 들어오는 값을 충분히 녹화해 두는 게 중요해요. 설치는 crates.io나 npm으로 하고 코딩 에이전트 네 종과 연동돼요. 속도는 워크로드에 따라 최대 20배라지만 경우마다 다르고, 라이선스는 MIT예요.
