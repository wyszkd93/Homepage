---
title: "녹음도 요약도 전부 내 컴퓨터 안에서 끝내는 오픈소스 회의록 Yogurt"
url: "https://github.com/FrigadeHQ/yogurt"
kind: github
date: 2026-11-16
tags: [오픈소스, 로컬AI, 회의록, 프라이버시]
comment: "회의 음성과 요약을 한 줄도 밖으로 안 내보내는 설계가 핵심이에요. 민감한 대화를 외부 서비스에 맡기는 게 꺼려지던 자리에, 전부 로컬에서 끝내는 선택지를 준다는 점이 오래 남아요."
original: "Private AI meeting notes. A free, open-source alternative to Granola. Your audio, transcripts and AI processing stay on your computer."
card:
  owner: "FrigadeHQ"
  name: "yogurt"
  site: "GitHub"
  stats:
    stars: 1635
    forks: 92
    asOf: "2026-11-16"
---

한 줄로 말하면 "회의록을 **클라우드에 안 올리고** 내 노트북 안에서만 만드는 앱"이에요. Granola 같은 AI 회의록 서비스의 오픈소스 대안으로, 마이크와 통화 음성을 녹음해 실시간 자막을 만들고 회의 요약까지 써 줘요. 핵심은 음성·녹취·AI 처리가 전부 로컬에 머문다는 점이에요. 전사는 whisper.cpp(맥은 Apple SpeechAnalyzer), 요약은 llama.cpp로 돌아가는 로컬 모델이 맡고, 네트워크는 모델 내려받기와 업데이트 확인에만 써요. 계정 없이 쓸 수 있고 라이선스는 MIT예요.

DBA·운영 눈으로 보면 이런 점이 눈에 들어와요.
- **민감 데이터를 밖에 안 흘리기**: 회의에 오가는 계정·키·내부 지표를 외부 전사 서비스에 넘기지 않는다는 건, 운영 로그나 쿼리를 외부 도구에 붙일 때 늘 걸리던 지점을 피하게 해 줘요
- **데이터 보관 위치가 명확함**: 기록이 맥은 `~/Library/Application Support/Yogurt`, 윈도우는 `%APPDATA%\Yogurt`에 떨어져서, 백업·삭제·접근 통제를 내가 아는 경로에서 직접 걸 수 있어요
- **읽기 권한을 좁혀 연동**: 로컬 MCP 서버로 내 노트를 다른 도구가 '허용할 때만' 읽게 하는 구조라, 필요한 범위만 열어 주는 최소 권한 운영 습관과 닮았어요

써 보기 전에 알아둘 것도 있어요. 로컬 모델을 돌리니 사양을 타요 — 맥은 Apple Silicon에 macOS 14.4 이상, 윈도우는 10(2004) 이상, 리눅스는 Ubuntu 22.04 이상에 메모리 8GB가 필요해요. 화자 구분(누가 말했는지)은 지금은 맥에서만 되고, 다국어 전사는 되지만 정확도는 환경에 따라 달라요. 회의 상대 동의 없는 녹음은 지역에 따라 법적 문제가 될 수 있으니 그 부분은 따로 챙겨야 해요.
