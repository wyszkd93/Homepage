---
title: "IBM MQ runmqsc 명령어 정리"
description: "IBM MQ의 MQSC 인터프리터 runmqsc로 큐, 채널, 리스너 등 MQ 오브젝트를 관리하는 명령어 모음과 운영 주의사항"
date: 2026-10-29
tags: ["IBM MQ", "MQSC", "runmqsc", "EAI"]
platform: mq
topic: ops
---

> `runmqsc` 는 IBM MQ의 MQSC(MQ Script Commands) 인터프리터입니다.  
> Queue Manager에 접속하여 큐, 채널, 리스너 등 MQ 오브젝트를 관리합니다.

---

## 목차

1. [runmqsc 실행](#1-runmqsc-실행)
2. [Queue Manager 관련](#2-queue-manager-관련)
3. [Queue 관련](#3-queue-관련)
4. [Channel 관련](#4-channel-관련)
5. [Listener 관련](#5-listener-관련)
6. [Process 관련](#6-process-관련)
7. [Topic 관련 (Pub/Sub)](#7-topic-관련-pubsub)
8. [Subscription 관련](#8-subscription-관련)
9. [Authentication & 보안](#9-authentication--보안)
10. [상태 조회 (DISPLAY STATUS)](#10-상태-조회-display-status)
11. [메시지 관련 유틸리티](#11-메시지-관련-유틸리티)
12. [주요 속성(Attribute) 참고](#12-주요-속성attribute-참고)
13. [⚠️ 주의사항 및 운영 팁](#13-️-주의사항-및-운영-팁)

---

## 1. runmqsc 실행

```bash
# 기본 실행 (로컬 Queue Manager)
runmqsc <QueueManagerName>

# 원격 Queue Manager에 접속
runmqsc -c <QueueManagerName>

# 스크립트 파일 실행
runmqsc <QueueManagerName> < script.mqsc

# 파이프로 명령 전달
echo "DISPLAY QMGR" | runmqsc <QueueManagerName>

# 결과를 파일로 저장
runmqsc <QueueManagerName> < script.mqsc > output.txt 2>&1
```

---

## 2. Queue Manager 관련

### Queue Manager 정보 조회

```mqsc
* Queue Manager 기본 정보 조회
DISPLAY QMGR

* 특정 속성만 조회
DISPLAY QMGR CCSID MAXMSGL MAXDEPTH

* 모든 속성 조회
DISPLAY QMGR ALL
```

### Queue Manager 속성 변경

```mqsc
* 최대 메시지 길이 변경
ALTER QMGR MAXMSGL(104857600)

* Dead Letter Queue 설정
ALTER QMGR DEADQ(SYSTEM.DEAD.LETTER.QUEUE)

* 채널 자동 정의 설정
ALTER QMGR CHAD(ENABLED) CHADEXIT(' ')
```

---

## 3. Queue 관련

### Queue 생성

```mqsc
* 로컬 큐 생성
DEFINE QLOCAL(MY.LOCAL.QUEUE)

* 속성 지정하여 로컬 큐 생성
DEFINE QLOCAL(MY.LOCAL.QUEUE) +
    DESCR('My local queue') +
    MAXDEPTH(5000) +
    MAXMSGL(4194304) +
    GET(ENABLED) +
    PUT(ENABLED) +
    REPLACE

* 원격 큐 정의 생성
DEFINE QREMOTE(MY.REMOTE.QUEUE) +
    RNAME(TARGET.QUEUE) +
    RQMNAME(REMOTE.QMGR) +
    XMITQ(TRANSMISSION.QUEUE)

* 전송 큐 생성
DEFINE QLOCAL(MY.XMIT.QUEUE) +
    USAGE(XMITQ) +
    REPLACE

* 별칭 큐 생성
DEFINE QALIAS(MY.ALIAS.QUEUE) +
    TARGET(MY.LOCAL.QUEUE) +
    REPLACE

* 모델 큐 생성
DEFINE QMODEL(MY.MODEL.QUEUE) +
    DEFTYPE(PERMDYN) +
    REPLACE
```

### Queue 조회

```mqsc
* 모든 로컬 큐 조회
DISPLAY QLOCAL(*)

* 특정 큐 조회
DISPLAY QLOCAL(MY.LOCAL.QUEUE)

* 모든 속성 조회
DISPLAY QLOCAL(MY.LOCAL.QUEUE) ALL

* 큐 depth 조회
DISPLAY QLOCAL(MY.LOCAL.QUEUE) CURDEPTH

* 이름 패턴으로 조회
DISPLAY QLOCAL(MY.*) CURDEPTH MAXDEPTH

* 원격 큐 조회
DISPLAY QREMOTE(*)

* 별칭 큐 조회
DISPLAY QALIAS(*)

* 전체 큐 타입 조회
DISPLAY Q(*) TYPE(ALL)
```

### Queue 수정

```mqsc
* 큐 속성 변경
ALTER QLOCAL(MY.LOCAL.QUEUE) MAXDEPTH(10000)

* GET/PUT 비활성화
ALTER QLOCAL(MY.LOCAL.QUEUE) GET(DISABLED) PUT(DISABLED)

* GET/PUT 활성화
ALTER QLOCAL(MY.LOCAL.QUEUE) GET(ENABLED) PUT(ENABLED)
```

### Queue 삭제

```mqsc
* 큐 삭제 (메시지 없을 때)
DELETE QLOCAL(MY.LOCAL.QUEUE)

* 큐 강제 삭제 (메시지 있어도)
DELETE QLOCAL(MY.LOCAL.QUEUE) PURGE

* 큐 삭제 (메시지 있으면 실패)
DELETE QLOCAL(MY.LOCAL.QUEUE) NOPURGE
```

### Queue 메시지 제거

```mqsc
* 큐의 모든 메시지 삭제
CLEAR QLOCAL(MY.LOCAL.QUEUE)
```

---

## 4. Channel 관련

### Channel 생성

```mqsc
* Sender 채널 생성
DEFINE CHANNEL(TO.REMOTE.QMGR) +
    CHLTYPE(SDR) +
    CONNAME('192.168.1.100(1414)') +
    XMITQ(MY.XMIT.QUEUE) +
    REPLACE

* Receiver 채널 생성
DEFINE CHANNEL(FROM.REMOTE.QMGR) +
    CHLTYPE(RCVR) +
    REPLACE

* Server-connection 채널 생성 (클라이언트 연결용)
DEFINE CHANNEL(SYSTEM.DEF.SVRCONN) +
    CHLTYPE(SVRCONN) +
    MCAUSER('mqm') +
    REPLACE

* 요청/응답 채널 생성
DEFINE CHANNEL(MY.REQUEST.CHANNEL) +
    CHLTYPE(REQUESTER) +
    CONNAME('192.168.1.100(1414)') +
    REPLACE
```

### Channel 조회

```mqsc
* 모든 채널 조회
DISPLAY CHANNEL(*)

* 특정 채널 조회
DISPLAY CHANNEL(MY.CHANNEL)

* 모든 속성 조회
DISPLAY CHANNEL(MY.CHANNEL) ALL

* 타입별 채널 조회
DISPLAY CHANNEL(*) CHLTYPE(SDR)
DISPLAY CHANNEL(*) CHLTYPE(RCVR)
DISPLAY CHANNEL(*) CHLTYPE(SVRCONN)
```

### Channel 상태 조회

```mqsc
* 채널 상태 조회
DISPLAY CHSTATUS(*)

* 특정 채널 상태 조회
DISPLAY CHSTATUS(MY.CHANNEL) ALL

* 활성 채널만 조회
DISPLAY CHSTATUS(*) STATUS(RUNNING)
```

### Channel 시작/중지/초기화

```mqsc
* 채널 시작
START CHANNEL(MY.CHANNEL)

* 채널 중지 (현재 전송 완료 후)
STOP CHANNEL(MY.CHANNEL)

* 채널 강제 중지
STOP CHANNEL(MY.CHANNEL) MODE(FORCE)

* 채널 즉시 종료
STOP CHANNEL(MY.CHANNEL) MODE(TERMINATE)

* 채널 초기화 (시퀀스 번호 리셋)
RESET CHANNEL(MY.CHANNEL)

* 채널 ping
PING CHANNEL(MY.CHANNEL)
```

### Channel 수정 및 삭제

```mqsc
* 채널 속성 변경
ALTER CHANNEL(MY.CHANNEL) DESCR('Updated description')

* 채널 삭제
DELETE CHANNEL(MY.CHANNEL)
```

---

## 5. Listener 관련

### Listener 생성 및 관리

```mqsc
* TCP 리스너 생성
DEFINE LISTENER(MY.LISTENER) +
    TRPTYPE(TCP) +
    PORT(1414) +
    REPLACE

* 리스너 조회
DISPLAY LISTENER(*)
DISPLAY LISTENER(MY.LISTENER) ALL

* 리스너 상태 조회
DISPLAY LSSTATUS(*)
DISPLAY LSSTATUS(MY.LISTENER)

* 리스너 시작
START LISTENER(MY.LISTENER)

* 리스너 중지
STOP LISTENER(MY.LISTENER)

* 리스너 삭제
DELETE LISTENER(MY.LISTENER)
```

---

## 6. Process 관련

```mqsc
* 프로세스 정의 생성
DEFINE PROCESS(MY.PROCESS) +
    DESCR('My trigger process') +
    APPLICID('/usr/bin/myapp') +
    USERDATA('param1 param2') +
    REPLACE

* 프로세스 조회
DISPLAY PROCESS(*)
DISPLAY PROCESS(MY.PROCESS) ALL

* 프로세스 수정
ALTER PROCESS(MY.PROCESS) USERDATA('new params')

* 프로세스 삭제
DELETE PROCESS(MY.PROCESS)
```

---

## 7. Topic 관련 (Pub/Sub)

```mqsc
* 토픽 생성
DEFINE TOPIC(MY.TOPIC) +
    TOPICSTR('sport/football') +
    REPLACE

* 토픽 조회
DISPLAY TOPIC(*)
DISPLAY TOPIC(MY.TOPIC) ALL

* 토픽 상태 조회
DISPLAY TPSTATUS('sport/#')

* 토픽 수정
ALTER TOPIC(MY.TOPIC) DESCR('Football sport topic')

* 토픽 삭제
DELETE TOPIC(MY.TOPIC)
```

---

## 8. Subscription 관련

```mqsc
* 구독 조회
DISPLAY SBSTATUS(*)

* 특정 구독 상태 조회
DISPLAY SBSTATUS(*) TYPE(SUB)

* 구독 삭제 (관리자 구독)
DELETE SUB(MY.SUBSCRIPTION)
```

---

## 9. Authentication & 보안

### Channel Authentication Records (CHLAUTH)

```mqsc
* 모든 CHLAUTH 규칙 조회
DISPLAY CHLAUTH(*)

* CHLAUTH 규칙 생성 (IP 차단)
SET CHLAUTH(SYSTEM.DEF.SVRCONN) +
    TYPE(ADDRESSMAP) +
    ADDRESS('*') +
    USERSRC(NOACCESS)

* CHLAUTH 규칙 생성 (사용자 매핑)
SET CHLAUTH(MY.CHANNEL) +
    TYPE(USERMAP) +
    CLNTUSER('appuser') +
    USERSRC(MAP) +
    MCAUSER('mquser')

* CHLAUTH 비활성화 (테스트 목적)
ALTER QMGR CHLAUTH(DISABLED)

* CHLAUTH 활성화
ALTER QMGR CHLAUTH(ENABLED)

* CHLAUTH 규칙 삭제
DELETE CHLAUTH(MY.CHANNEL) TYPE(USERMAP) CLNTUSER('appuser')
```

### Authority Records

```mqsc
* 오브젝트 권한 조회
DISPLAY AUTHREC OBJTYPE(QMGR)
DISPLAY AUTHREC PROFILE(MY.QUEUE) OBJTYPE(QUEUE)

* 권한 부여
SET AUTHREC PROFILE(MY.QUEUE) +
    OBJTYPE(QUEUE) +
    PRINCIPAL('appuser') +
    AUTHADD(PUT,GET,INQ,BROWSE)

* 권한 제거
SET AUTHREC PROFILE(MY.QUEUE) +
    OBJTYPE(QUEUE) +
    PRINCIPAL('appuser') +
    AUTHRMV(PUT,GET)
```

---

## 10. 상태 조회 (DISPLAY STATUS)

```mqsc
* Queue Manager 상태 조회
DISPLAY QMSTATUS

* 큐 입출력 상태 조회
DISPLAY QSTATUS(MY.QUEUE)
DISPLAY QSTATUS(*) TYPE(QUEUE)

* 핸들 오픈 상태 조회
DISPLAY QSTATUS(*) TYPE(HANDLE)

* 연결 상태 조회
DISPLAY CONN(*) ALL

* 특정 태스크 연결 조회
DISPLAY CONN(*) TYPE(CONN)
DISPLAY CONN(*) TYPE(HANDLE)
```

---

## 11. 메시지 관련 유틸리티

### 트리거 관련

```mqsc
* 트리거 모니터 시작
START TMQNAME(MY.INIT.QUEUE)

* 채널 이니셔에이터 시작
START CHINIT
```

### 서비스 관련

```mqsc
* 서비스 정의 생성
DEFINE SERVICE(MY.SERVICE) +
    SERVTYPE(SERVER) +
    STARTCMD('/usr/bin/myservice') +
    STOPCMD('/usr/bin/mystop') +
    REPLACE

* 서비스 조회
DISPLAY SERVICE(*)

* 서비스 상태 조회
DISPLAY SVSTATUS(*)

* 서비스 시작/중지
START SERVICE(MY.SERVICE)
STOP SERVICE(MY.SERVICE)

* 서비스 삭제
DELETE SERVICE(MY.SERVICE)
```

---

## 12. 주요 속성(Attribute) 참고

### Queue 주요 속성

| 속성 | 설명 | 예시 값 |
|------|------|---------|
| `MAXDEPTH` | 최대 큐 깊이 | `5000` |
| `MAXMSGL` | 최대 메시지 길이 (bytes) | `4194304` |
| `CURDEPTH` | 현재 큐 메시지 수 | (읽기 전용) |
| `GET` | GET 허용 여부 | `ENABLED`, `DISABLED` |
| `PUT` | PUT 허용 여부 | `ENABLED`, `DISABLED` |
| `DEFPSIST` | 기본 퍼시스턴스 | `PERSISTENT`, `NONPERSISTENT` |
| `DEFSOPT` | 기본 공유 옵션 | `SHARED`, `EXCL` |
| `USAGE` | 큐 사용 목적 | `NORMAL`, `XMITQ` |
| `DESCR` | 설명 | `'My queue'` |
| `BOQNAME` | Backout Queue 이름 | `MY.BO.QUEUE` |
| `BOTHRESH` | Backout 임계값 | `5` |
| `TRIGTYPE` | 트리거 타입 | `FIRST`, `EVERY`, `DEPTH`, `NONE` |
| `TRIGDPTH` | 트리거 깊이 | `1` |
| `INITQ` | 초기화 큐 이름 | `SYSTEM.DEFAULT.INITIATION.QUEUE` |
| `PROCESS` | 트리거 프로세스 | `MY.PROCESS` |

### Channel 주요 속성

| 속성 | 설명 | 예시 값 |
|------|------|---------|
| `CHLTYPE` | 채널 타입 | `SDR`, `RCVR`, `SVRCONN`, `CLNTCONN` |
| `CONNAME` | 연결 대상 주소 | `'192.168.1.100(1414)'` |
| `XMITQ` | 전송 큐 이름 | `MY.XMIT.QUEUE` |
| `MCAUSER` | MCA 사용자 ID | `'mqm'` |
| `BATCHSZ` | 배치 크기 | `50` |
| `DISCINT` | 연결 끊김 간격 (초) | `6000` |
| `HBINT` | Heartbeat 간격 (초) | `300` |
| `MAXMSGL` | 최대 메시지 길이 | `4194304` |
| `COMPHDR` | 헤더 압축 | `NONE`, `SYSTEM` |
| `COMPMSG` | 메시지 압축 | `NONE`, `ZLIBFAST`, `ZLIBHIGH` |
| `SSLCIPH` | SSL/TLS 암호화 알고리즘 | `TLS_RSA_WITH_AES_256_CBC_SHA256` |
| `SSLCAUTH` | SSL 클라이언트 인증 | `REQUIRED`, `OPTIONAL` |

### Queue Manager 주요 속성

| 속성 | 설명 | 예시 값 |
|------|------|---------|
| `DEADQ` | Dead Letter Queue | `SYSTEM.DEAD.LETTER.QUEUE` |
| `MAXMSGL` | 최대 메시지 길이 | `104857600` |
| `MAXUMSGS` | 최대 uncommit 메시지 수 | `10000` |
| `CCSID` | 코드 페이지 | `1208` (UTF-8) |
| `REPOS` | 저장소 큐 매니저 이름 | `MY.REPOS.QMGR` |
| `REPOSNL` | 저장소 네임리스트 | `MY.REPOS.NAMELIST` |
| `CHLAUTH` | Channel Auth 활성화 | `ENABLED`, `DISABLED` |
| `CONNAUTH` | Connection Auth | `SYSTEM.DEFAULT.AUTHINFO.IDPWOS` |
| `CHAD` | 자동 채널 정의 | `ENABLED`, `DISABLED` |

---

## 빠른 참조 - 자주 쓰는 명령어

```mqsc
* Queue Manager 정보 확인
DISPLAY QMGR ALL

* 모든 로컬 큐와 현재 깊이 확인
DISPLAY QLOCAL(*) CURDEPTH MAXDEPTH

* 실행 중인 채널 확인
DISPLAY CHSTATUS(*) STATUS(RUNNING)

* 리스너 상태 확인
DISPLAY LSSTATUS(*)

* 현재 연결 확인
DISPLAY CONN(*) TYPE(CONN)

* 큐 메시지 즉시 제거
CLEAR QLOCAL(MY.QUEUE)

* 채널 강제 중지
STOP CHANNEL(MY.CHANNEL) MODE(FORCE)

* MQSC 종료
END
```

---

> **참고:** MQSC 명령어는 대소문자를 구분하지 않습니다.  
> 긴 명령어는 `+` 로 줄바꿈 연속 입력이 가능합니다.  
> `*` 로 시작하는 줄은 주석입니다.

---

## 13. ⚠️ 주의사항 및 운영 팁

### 🔴 데이터 손실 위험 명령어

#### CLEAR QLOCAL — 메시지 영구 삭제

```mqsc
* ❌ 복구 불가 — 큐의 모든 메시지가 즉시 영구 삭제됨
CLEAR QLOCAL(MY.QUEUE)
```

> 실행 전 반드시 `DISPLAY QLOCAL(MY.QUEUE) CURDEPTH` 로 메시지 수를 확인하고,
> 정말 삭제해도 되는지 재확인할 것. **되돌릴 방법 없음.**

#### DELETE QLOCAL PURGE — 큐 및 메시지 동시 삭제

```mqsc
* ❌ 큐와 메시지를 한 번에 모두 삭제
DELETE QLOCAL(MY.QUEUE) PURGE
```

> `PURGE` 옵션 없이 실행하면 메시지가 있을 경우 오류로 안전하게 실패함.
> 운영 환경에서는 가급적 `NOPURGE` 를 기본으로 사용할 것.

---

### 🔴 채널 관련 주의사항

#### RESET CHANNEL — 시퀀스 번호 리셋

```mqsc
* ⚠️ 양쪽 Queue Manager 모두 동시에 리셋해야 함
RESET CHANNEL(MY.CHANNEL) SEQNUM(1)
```

> 한쪽만 리셋하면 시퀀스 불일치로 채널이 `IN-DOUBT` 상태가 됨.
> 반드시 **양단(Sender/Receiver) 동시 실행** 필요.

#### STOP CHANNEL MODE(FORCE) — 강제 중지

```mqsc
* ⚠️ 전송 중인 메시지가 유실될 수 있음
STOP CHANNEL(MY.CHANNEL) MODE(FORCE)
```

> 가능하면 `MODE(QUIESCE)` (기본값) 로 정상 종료 후,
> 응답 없을 때만 `FORCE` 사용.  
> `MODE(TERMINATE)` 는 더 강력하며 In-doubt 트랜잭션이 발생할 수 있음.

#### In-Doubt 채널 처리

```mqsc
* In-Doubt 상태 확인
DISPLAY CHSTATUS(MY.CHANNEL) INDOUBT

* In-Doubt 채널 강제 커밋 (데이터 유실 가능)
RESOLVE CHANNEL(MY.CHANNEL) ACTION(COMMIT)

* In-Doubt 채널 강제 롤백
RESOLVE CHANNEL(MY.CHANNEL) ACTION(BACKOUT)
```

> `RESOLVE` 명령은 최후의 수단. 상대방 Queue Manager와 상태를 먼저 확인 후 실행.

---

### 🔴 보안 관련 주의사항

#### CHLAUTH 비활성화 금지 (운영 환경)

```mqsc
* ❌ 절대 운영 환경에서 실행 금지
ALTER QMGR CHLAUTH(DISABLED)
```

> CHLAUTH를 비활성화하면 모든 클라이언트 연결 제한이 해제되어
> **인증 없이 누구나 접속 가능**한 상태가 됨.
> 테스트 환경에서만 일시적으로 사용하고, 작업 후 즉시 재활성화할 것.

#### MCAUSER 설정 주의

```mqsc
* ⚠️ mqm 계정을 MCAUSER로 사용하면 관리자 권한 부여됨
DEFINE CHANNEL(MY.CHANNEL) CHLTYPE(SVRCONN) MCAUSER('mqm')
```

> `mqm` 대신 최소 권한의 전용 애플리케이션 계정을 사용하는 것을 권장.
> 빈 문자열 `MCAUSER(' ')` 설정 시 클라이언트가 전달한 ID를 그대로 사용하므로
> 반드시 CHLAUTH 규칙과 함께 구성할 것.

---

### 🟡 운영 중 변경 시 주의사항

#### ALTER vs DEFINE REPLACE

```mqsc
* ✅ 운영 중 속성 변경은 ALTER 사용 (기존 연결 유지)
ALTER QLOCAL(MY.QUEUE) MAXDEPTH(10000)

* ⚠️ DEFINE REPLACE는 오브젝트를 재생성 — 연결 중인 애플리케이션에 영향
DEFINE QLOCAL(MY.QUEUE) MAXDEPTH(10000) REPLACE
```

> `DEFINE ... REPLACE` 는 기존 오브젝트를 삭제하고 새로 만드는 것과 동일.
> 채널에 적용 시 현재 연결이 끊길 수 있으므로 운영 중엔 `ALTER` 를 사용할 것.

#### Queue GET/PUT 비활성화 시 영향

```mqsc
* ⚠️ 실행 즉시 해당 큐에 접근 중인 애플리케이션에 오류 발생
ALTER QLOCAL(MY.QUEUE) GET(DISABLED)
```

> 점검 전 연결된 애플리케이션을 먼저 정상 종료하거나
> 담당 팀에 사전 공지 후 실행할 것.

---

### 🟡 SYSTEM.* 오브젝트 수정 금지

```mqsc
* ❌ 시스템 기본 오브젝트는 수정/삭제 금지
DELETE QLOCAL(SYSTEM.DEFAULT.LOCAL.QUEUE)
ALTER CHANNEL(SYSTEM.DEF.SVRCONN) MCAUSER('mqm')
```

> `SYSTEM.*` 으로 시작하는 오브젝트는 IBM MQ 내부 동작에 필수적인 기본 오브젝트.
> 잘못 수정하면 Queue Manager 전체 동작에 영향을 줄 수 있음.
> 반드시 IBM 공식 문서를 참조하고, 변경 전 백업(dmpmqcfg) 수행.

---

### 🟡 스크립트 실행 시 주의사항

#### 오류가 발생해도 스크립트가 계속 실행됨

```bash
# ⚠️ 중간에 오류가 나도 다음 명령이 계속 실행됨
runmqsc QMGR < script.mqsc

# ✅ 결과를 파일로 저장하여 오류 여부 반드시 확인
runmqsc QMGR < script.mqsc > result.txt 2>&1
grep -i "AMQ[0-9]*E" result.txt  # 오류 메시지(E) 확인
grep -i "AMQ[0-9]*W" result.txt  # 경고 메시지(W) 확인
```

> MQSC 스크립트는 한 명령이 실패해도 나머지 명령을 계속 실행함.
> 실행 후 반드시 출력 로그를 검토하여 모든 명령이 성공했는지 확인할 것.

---

### 🟢 운영 모범 사례 (Best Practices)

| 항목 | 권장 사항 |
|------|-----------|
| 변경 전 백업 | `dmpmqcfg -m QMGR -a > backup.mqsc` 로 전체 설정 백업 |
| 큐 삭제 전 확인 | `DISPLAY QLOCAL(Q) CURDEPTH IPPROCS OPPROCS` 로 사용 여부 확인 |
| 채널 중지 순서 | Sender → Receiver 순으로 중지, 시작은 반대 순서 |
| Dead Letter Queue | 반드시 설정 (`ALTER QMGR DEADQ(...)`) 및 모니터링 |
| 최대 큐 깊이 | 운영 중 `CURDEPTH` / `MAXDEPTH` 비율을 주기적으로 모니터링 |
| CHLAUTH | 항상 활성화 상태 유지, IP/사용자 기반 화이트리스트 운영 |
| 로그 확인 | 오류 발생 시 `/var/mqm/qmgrs/<QMGR>/errors/AMQERR01.LOG` 확인 |
