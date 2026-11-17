---
title: "몽글이 키우기"
description: "알에서 깨어난 도트 펫을 돌보고 키우는 가상 펫 게임 — PWA 설치·클라우드 저장·30종 진화 도감"
date: 2026-11-03
repo: "https://github.com/wyszkd93/game"
demo: "https://mongle-pet.netlify.app"
tech: [JavaScript, HTML, PWA, Firebase, Netlify]
tags: [게임, 가상펫, PWA, 도트]
status: active
cover: "/images/projects/mongle-pet/cover.png"
shot: "/images/projects/mongle-pet/shots.png"
summary: "작은 방에서 도트 펫을 알부터 어른까지 키우는 가상 펫 게임이에요. 밥·간식·씻기·별 받기 미니게임으로 돌보면 키운 방식에 따라 다르게 진화하고, 휴대폰에 앱처럼 설치해 오프라인에서도 돌아가요."
motivation: "다마고치 같은 가상 펫을 설치 없이 휴대폰에서 바로 하고, 기기를 바꿔도 이어서 키우고 싶었어요. 그래서 웹 앱(PWA)으로 만들어 홈 화면에 설치되고 오프라인에서도 돌아가게 하고, 로그인하면 클라우드에 저장돼 다른 기기에서 이어 하도록 했어요. 게임 로직부터 로그인·저장 백엔드, 스토어 등록까지 혼자 만든 프로젝트예요."
features:
  - { icon: "🥚", title: "키운 대로 달라지는 진화", desc: "알 → 아기 → 어른으로 자라고, 밥·씻기·재우기 등 돌본 방식에 따라 5가지 모습으로 진화해 도감에 모여요(전체 30종)." }
  - { icon: "⭐", title: "돌보기 루프와 미니게임", desc: "떨어지는 별은 받고 돌은 피하는 '별 받기'로 코인을 모아, 케이크·리본·왕관을 사고 펫의 소원을 들어줘요." }
  - { icon: "☁️", title: "어디서나 이어 하기", desc: "카카오·Google·이메일로 로그인하면 기록이 Firestore에 저장돼, 기기를 바꿔도 이어 키워요. 로그인 안 해도 기기에 저장돼요." }
  - { icon: "📱", title: "휴대폰 앱처럼(PWA)", desc: "홈 화면에 설치하면 전체 화면으로 열리고 인터넷 없이도 동작해요. 방 창밖 하늘은 실제 시간에 맞춰 낮·노을·밤으로 바뀌어요." }
notes:
  - { title: "바빠도 괜찮은 안심 모드", desc: "앱을 닫아 두거나 한동안 안 만지면 '안심 모드'로 바뀌어, 최대 3일까지 펫이 아프거나 쓰러지지 않고 얌전히 기다려요." }
  - { title: "공개 설정과 실제 비밀 분리", desc: "리포에는 공개돼도 되는 식별자(Firebase 웹 설정 등)만 두고, 카카오 Client Secret·서비스 계정 키 같은 진짜 비밀은 서버(Netlify) 환경변수에만 둬요. 보안은 Firestore 규칙과 승인된 도메인이 담당해요." }
  - { title: "무료 사용량 안에서 저장", desc: "2분마다·앱을 내릴 때·'지금 저장'을 누를 때만 저장하도록 횟수를 제한해, Firebase 무료 한도 안에서 돌아가게 했어요." }
---

## 해보기

<p class="play-cta"><a href="https://mongle-pet.netlify.app" target="_blank" rel="noopener noreferrer">▶ 바로 플레이하기</a></p>

휴대폰에서 열고 "홈 화면에 추가"를 하면 앱처럼 설치돼요 — 아이폰은 Safari 공유 → 홈 화면에 추가, 안드로이드는 Chrome 메뉴 → 앱 설치. 로그인은 선택이라, 안 해도 그 기기에 저장돼요.

처음 시작할 때 친구 하나를 골라 이름을 지어 주면 알에서 깨어나요.

<p class="friends"><span>🐱 고양이</span><span>🐶 강아지</span><span>🐻 곰</span><span>🦊 여우</span><span>🐼 판다</span><span>🦝 너구리</span></p>

<div class="buildbox">
<b>기술</b> &middot; 프레임워크 없는 바닐라 JavaScript, PWA(서비스 워커·오프라인 캐시), 로그인·클라우드 저장은 Firebase(Auth·Firestore), 카카오 로그인은 Netlify 함수로 토큰 교환<br>
<b>폰트</b> &middot; 도트 폰트 Galmuri11 (OFL-1.1)
</div>
