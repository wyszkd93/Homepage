---
title: "컨테이너 없이 AI 에이전트를 가두는 Anthropic의 샌드박스, srt"
url: "https://github.com/anthropics/sandbox-runtime"
kind: github
date: 2026-11-03
tags: [보안, 에이전트, Claude Code]
license: "Apache-2.0"
comment: "Docker까지 띄우긴 부담스럽고 맨 프로세스로 돌리긴 불안한 에이전트·MCP 서버를, 명령 앞에 srt 한 단어로 묶어 둘 수 있다는 게 핵심이에요. DBA 입장에선 운영 서버에서 스크립트를 돌릴 때 '읽어도 되는 곳·나가도 되는 주소'를 미리 정해 두는 습관과 닮았어요."
original: "A lightweight sandboxing tool for enforcing filesystem and network restrictions on arbitrary processes at the OS level, without requiring a container."
card:
  owner: anthropics
  name: sandbox-runtime
  stats: { contributors: 38, usedBy: 937, stars: 7000, forks: 573, asOf: "2026-11-03" }
---

**Sandbox Runtime**(srt)은 Claude Code를 더 안전하게 쓰려고 Anthropic이 만든 가벼운 격리 도구예요. 컨테이너를 띄우지 않고 운영체제가 원래 가진 기능으로 프로세스를 가둬요. macOS에서는 `sandbox-exec`, Linux에서는 `bubblewrap`을 쓰고, 네트워크는 프록시를 거쳐 허용한 주소만 내보내요.

막을 수 있는 건 크게 네 가지예요. 접속할 수 있는 도메인, 읽고 쓸 수 있는 폴더·파일, 로컬 유닉스 소켓, 그리고 macOS에서는 규칙 위반을 실시간으로 알려 주는 감시까지요. 기본값이 "전부 막고 필요한 구멍만 연다"라서, `srt "curl example.com"`처럼 허용 목록에 없는 주소는 바로 차단돼요.

쓰는 방법은 두 가지예요. 명령 앞에 `srt`를 붙여 CLI로 쓰거나, `.mcp.json`의 `command` 자리에 끼워 MCP 서버를 통째로 가둘 수 있어요. 라이브러리로 불러 다른 도구 안에 넣는 것도 가능해요. 아직 연구용 미리보기(베타)라 설정 형식은 바뀔 수 있어요.
