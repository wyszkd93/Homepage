---
title: "링크 하나 던지면 Obsidian 노트가 되는 Claude Code 플러그인, Knowledge Manager"
url: "https://github.com/treylom/knowledge-manager"
kind: github
date: 2026-11-03
tags: [Claude Code, 플러그인, Obsidian, 지식관리]
license: "MIT"
comment: "'읽고 끝'이던 링크를 요약·태그·연결까지 된 노트로 쌓고, 나중엔 질문 한 줄로 다시 꺼내는 흐름을 플러그인 하나로 묶었어요. 블로그 글감이나 장애 대응 자료를 모아 두는 용도로도 써 볼 만해요."
original: "A Claude Code plugin that turns what you read and watch into Obsidian notes, and finds those notes again later."
card:
  owner: treylom
  name: knowledge-manager
---

**Knowledge Manager**는 웹 글, 유튜브, PDF, 오피스 문서, Notion 페이지 같은 자료를 Obsidian 노트로 정리해 주는 Claude Code 플러그인이에요. `/km:knowledge-manager <링크>`를 치면 요약하고 태그를 달고, 이미 있는 관련 노트와 링크까지 이어서 vault에 저장해요. 저장 전에는 중복·모순·빠진 내용을 스스로 점검해요.

다시 찾을 땐 `/km:search 질문`이면 돼요. 짧은 키워드는 빠른 답, "비교·방법" 같은 문장형 질문은 연결된 노트까지 엮은 자세한 답으로 알아서 나눠 줘요. 검색 엔진은 GraphRAG 서버가 있으면 그걸, 없으면 Obsidian 검색이나 텍스트 검색으로 넘어가요.

처음엔 `/km:setup`으로 vault 경로와 도구를 정하고 "어떤 일을 하는 사람인지" 짧은 인터뷰를 해요. 그 밖에 vault 구조 상담(`/km:interview`), 노트 수백 개의 폴더·링크를 계획서부터 만들어 한꺼번에 바꾸는 `/km:reform`, 큰 PDF를 쪼개 변환하는 `/km:pdf`도 들어 있어요. MIT 라이선스예요.
