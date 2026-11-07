---
title: "AI에게 매번 새 Windows PC를 주고 쓰고 나면 지워 버리는 sandbox-mcp"
url: "https://github.com/shanselman/sandbox-mcp"
kind: github
date: 2026-11-08
tags: [Windows, 테스트, MCP, 설치 점검]
license: "MIT"
comment: "'내 PC에선 되는데요'를 사람 대신 AI가 깨끗한 PC로 확인해 주는 그림이에요. 고객사 PC 환경을 떠올리며 마음 졸이던 배포 전날이 조금은 편해질 것 같아요."
original: "Fresh, throwaway Windows machines for testing your apps: an MCP server and CLI that automate Windows Sandbox"
card:
  owner: shanselman
  name: sandbox-mcp
  stats: { stars: 251, forks: 12, asOf: "2026-11-08" }
---

한 줄로 말하면 "**한 번 쓰고 버리는** 새 PC 대여점"이에요. Windows에 들어 있는 Windows Sandbox를 자동으로 다뤄서, 아무것도 깔리지 않은 깨끗한 Windows 11을 몇십 초 만에 띄우고, 프로그램을 올려 실행하고, 화면을 눌러 보고, 결과와 스크린샷을 남긴 뒤 PC를 통째로 지워요. 명령줄 도구 `sbx`로 바로 쓰거나, MCP 서버로 붙여 AI 에이전트가 직접 시험하게 할 수 있어요.

DBA 눈으로 보면 이렇게 써 볼 수 있어요.
- **클라이언트 설치 점검**: Oracle Instant Client나 ODBC 드라이버를 새 PC에 깔았을 때 VC++ 재배포 패키지 같은 빠진 구성 요소가 있는지, 사용자에게 나가기 전에 확인할 수 있어요
- **배포용 설치 스크립트 검증**: 사내 PC에 돌리는 tnsnames.ora 배포, 환경 변수 설정 스크립트를 깨끗한 PC에서 돌려 보고 무엇이 바뀌었는지 설치 전후 차이로 남길 수 있어요
- **수상한 첨부 파일 격리 실행**: 출처가 불분명한 DB 툴 설치 파일을 네트워크를 끈 상태로 먼저 돌려 보는 용도로도 쓸 수 있어요

써 보기 전에 알아둘 것도 있어요. Windows Sandbox가 들어 있는 Windows Pro나 Enterprise가 필요하고, Home 버전에서는 안 돼요. 한 번에 한 대만 띄울 수 있고, 끄면 모든 게 사라지니 오래 두고 쓰는 환경이 필요하면 가상 머신이 맞아요. 릴리스 파일에 Node.js가 들어 있어 따로 설치할 필요는 없어요. 라이선스는 MIT예요.
