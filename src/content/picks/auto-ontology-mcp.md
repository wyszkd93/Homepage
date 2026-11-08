---
title: "AI가 쿼리를 짜기 전에 조인과 값부터 확인하게 하는 MCP 서버, auto-ontology-mcp"
url: "https://github.com/gogoymh/auto-ontology-mcp"
kind: github
date: 2026-11-09
tags: [Text-to-SQL, MCP, 데이터 사전, 읽기 전용]
license: "Apache-2.0"
comment: "AI가 만든 쿼리의 무서운 점은 틀려도 결과가 '그럴듯하게' 나온다는 건데, 이 도구는 그 지점을 정면으로 다뤄요. 쿼리를 대신 짜 주는 도구가 아니라 쿼리 검토자를 붙여 주는 도구에 가까워요."
original: "NVIDIA Auto Ontology's semantic layer and a personal knowledge base as an MCP server for Claude, ChatGPT and other MCP clients."
card:
  owner: gogoymh
  name: auto-ontology-mcp
  stats: { stars: 211, forks: 31, asOf: "2026-11-09" }
---

한 줄로 말하면 "AI 옆에 앉은 **깐깐한 선임 DBA**"예요. 며칠 전 소개한 NVIDIA Auto Ontology의 데이터 사전 기능을 MCP 서버로 감싸서, Claude Code나 Codex 같은 도구가 DB에 질문할 때 먼저 테이블 관계와 실제 저장된 값을 확인하게 해 줘요. 따로 모델 서버나 API 키 없이, 지금 쓰는 AI가 스키마를 읽고 관계를 정리하면 서버는 그걸 저장하고 쿼리를 검사해요.

DBA 눈으로 보면 이런 점이 반가워요.
- **엉뚱한 조인 차단**: 숫자가 우연히 겹친다고 고객 번호와 주문 번호를 조인하는 식의 실수를, 정리해 둔 관계와 맞춰 보고 실행 전에 막아 줘요
- **값과 단위 확인**: '서울'로 저장된 값을 'seoul'로 찾거나, 0~1 비율 컬럼에 20을 넣는 실수를 실제 데이터를 보고 짚어 줘요
- **중복 집계 경고**: 1:N 조인 뒤에 금액을 SUM 해서 매출이 부풀려지는 경우를 미리 알려 줘요

써 보기 전에 알아둘 것도 있어요. `uvx` 한 줄로 실행되고 Python 3.12 이상이 필요해요. 지원 DB는 SQLite, PostgreSQL, DuckDB, MySQL이라 Oracle에는 아직 바로 붙일 수 없어요. 쿼리는 SELECT 한 문장만 읽기 전용 연결로 실행하고 매번 롤백하며, 30초 제한과 최대 500행 제한이 걸려 있어요. 운영 DB 대신 복제본이나 분석용 DB에 붙이는 게 좋아요. 라이선스는 Apache 2.0이에요.
