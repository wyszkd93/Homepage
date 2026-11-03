---
title: "링크 하나 던지면 Obsidian 노트가 되는 Claude Code 플러그인, Knowledge Manager"
url: "https://github.com/treylom/knowledge-manager"
kind: github
date: 2026-11-03
tags: [Claude Code, 플러그인, Obsidian, 지식관리]
license: "MIT"
comment: "'읽고 끝'이던 링크가 다시 꺼내 쓸 수 있는 지식으로 남는다는 점이 좋아요. 비슷한 장애를 두 번째 만났을 때 진가가 나올 도구예요."
original: "A Claude Code plugin that turns what you read and watch into Obsidian notes, and finds those notes again later."
card:
  owner: treylom
  name: knowledge-manager
---

한 줄로 말하면 "읽은 걸 **노트로 바꿔 쌓아 주는** 비서"예요. 링크 하나를 던지면 요약하고 태그를 달고, 내 Obsidian vault에 있는 비슷한 노트와 이어서 저장해 줘요. 웹 글, 유튜브, PDF, 오피스 문서, Notion 페이지까지 받아요.

DBA 눈으로 보면 이렇게 쓸 만해요.
- **장애 대응 자료 모으기**: 그때그때 본 MOS 문서·블로그 링크를 던져 두면, 같은 에러 코드끼리 알아서 엮여요
- **나중에 다시 찾기**: `/km:search ORA-01555 대처법`처럼 물으면 쌓아 둔 노트를 엮어서 답해 줘요
- **블로그 글감 창고**: 읽고 흘려보내던 글이 태그 붙은 메모로 남아서, 글 쓸 때 꺼내 쓰기 좋아요

써 보기 전에 알아둘 것도 있어요. 처음엔 `/km:setup`으로 vault 위치와 하는 일을 짧게 알려 줘야 해요. 노트가 수백 개로 늘면 `/km:reform`으로 폴더·링크를 한꺼번에 정리할 수 있고, 큰 PDF는 `/km:pdf`로 나눠서 바꿔요. MIT 라이선스예요.
