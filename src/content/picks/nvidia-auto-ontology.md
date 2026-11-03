---
title: "AI 에이전트에게 우리 회사 데이터 사전을 쥐여 주는 오픈소스, NVIDIA Auto Ontology"
url: "https://github.com/NVIDIA/auto-ontology"
kind: github
date: 2026-11-04
tags: [Text-to-SQL, 에이전트, 데이터 카탈로그, PostgreSQL]
license: "Apache-2.0"
comment: "자연어로 SQL을 뽑는 도구는 많지만, '그 숫자가 맞는지'를 업무 정의와 계보로 따져 본다는 데 무게를 둔 점이 반가워요. 결국 좋은 메타데이터를 가진 팀이 AI도 잘 쓰게 된다는 얘기라서, DBA가 할 일이 오히려 늘어날 것 같아요."
original: "Auto Ontology is a Python framework for building semantic, graph-based reasoning layers over data. It enables deterministic query generation, better context retrieval, and more explainable AI for LLM and agent workflows."
card:
  owner: NVIDIA
  name: auto-ontology
  stats: { stars: 2776, forks: 219, asOf: "2026-11-04" }
---

한 줄로 말하면 "AI 에이전트용 **데이터 사전**을 자동으로 만들어 주는 도구"예요. 테이블·컬럼 메타데이터를 읽어 업무 용어, 지표, 테이블 사이 관계를 온톨로지(지식 그래프)로 정리해 두고, 에이전트가 질문을 받으면 그 사전을 보고 SQL을 만들어 실행해요. 만든 쿼리는 미리 정해 둔 지표 정의와 데이터 계보에 비춰 검증하고, 답에 근거를 붙여 돌려줘요.

DBA 눈으로 보면 이럴 때 떠올라요.
- **"매출" 정의가 부서마다 다를 때**: 취소 포함 여부처럼 팀마다 다른 계산식을 사전에 한 번 확정해 두면, 에이전트가 엉뚱한 컬럼을 더하는 일을 줄일 수 있어요
- **현업의 즉석 조회 요청**: "지난달 지역별 신규 가입자 수" 같은 질문을 에이전트가 받아 SQL로 바꾸고, 어떤 테이블·조건을 썼는지 같이 보여 줘서 검토가 쉬워요
- **흩어진 주석·코멘트 정리**: 컬럼 코멘트와 기존 의미 모델을 모아 한곳에 연결해 주니, 오래 묵은 데이터 사전을 다시 살리는 계기가 될 수 있어요

써 보기 전에 알아둘 것도 있어요. Docker Compose나 Kubernetes(Helm)로 띄우는 꽤 큰 구성(웹 UI, FastAPI 백엔드, 수집 워커, pgvector 포함 Postgres)이고, 추론에는 NVIDIA NIM이나 OpenAI 호환 모델 엔드포인트와 API 키가 필요해요. 연결 가능한 원본 DB는 지금 Databricks, PostgreSQL, Snowflake, DuckDB라서 Oracle은 아직 목록에 없어요. 에이전트와는 MCP·CLI·API로 붙고, Apache-2.0 라이선스예요. 현재는 외부 기여를 받지 않는다고 밝혀 두었어요.
