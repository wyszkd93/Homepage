---
title: "컨테이너 없이 AI 에이전트를 가두는 Anthropic의 샌드박스, srt"
url: "https://github.com/anthropics/sandbox-runtime"
kind: github
date: 2026-11-03
tags: [보안, 에이전트, Claude Code]
license: "Apache-2.0"
comment: "에이전트를 믿고 맡기되 '어디까지'는 내가 정한다는 발상이 마음에 들어요. 운영 서버에서 권한을 최소로 주던 습관을 AI 도구에도 그대로 이어 갈 수 있어요."
original: "A lightweight sandboxing tool for enforcing filesystem and network restrictions on arbitrary processes at the OS level, without requiring a container."
card:
  owner: anthropics
  name: sandbox-runtime
  stats: { contributors: 38, usedBy: 937, stars: 7000, forks: 573, asOf: "2026-11-03" }
---

한 줄로 말하면 "Docker 없이 치는 **울타리**"예요. 명령 앞에 `srt` 한 단어만 붙이면, 그 프로세스는 허락한 폴더와 허락한 주소 말고는 아무 데도 손을 못 대요. 컨테이너를 띄우는 대신 운영체제가 원래 가진 격리 기능(macOS `sandbox-exec`, Linux `bubblewrap`)을 빌려 써서 가벼워요.

DBA 눈으로 보면 이럴 때 반가워요.
- **AI 에이전트에게 점검 스크립트를 맡길 때**: `/u01/app` 아래는 읽기만, 쓰기는 작업 폴더 하나만 열어 두기
- **처음 보는 MCP 서버를 붙일 때**: `.mcp.json`의 `command` 앞에 끼워서, 사내망이나 엉뚱한 외부 주소로 못 나가게 막기
- **"혹시 몰라" 싶은 설치 스크립트**: 기본이 전부 차단이라, 필요한 도메인만 하나씩 열면서 무슨 일을 하려는지 확인하기

써 보기 전에 알아둘 것도 있어요. 아직 연구용 미리보기(베타)라 설정 형식이 바뀔 수 있고, 위반을 실시간으로 알려 주는 감시는 macOS에서만 돼요. 라이브러리로 불러 다른 도구 안에 넣는 방법도 있어요.
