---
title: "겨울 호수 낚시"
description: "펭귄으로 겨울 호수에서 낚시하며 물고기 40종을 모으는 3D 캐주얼 게임"
date: 2026-11-24
repo: "https://github.com/wyszkd93/game"
demo: "https://wyszkd93.github.io/Game/fishing/"
tech: [JavaScript, HTML, "Three.js", 멀티플레이]
tags: [게임, 낚시, 3D, 멀티플레이]
status: active
cover: "/images/projects/winter-lake-fishing/scene.png"
shot: "/images/projects/winter-lake-fishing/dex.png"
summary: "눈 덮인 호수에서 펭귄으로 낚시하는 아늑한 3D 게임이에요. 던지고 입질을 기다렸다가 타이밍으로 당겨 올리고, 무엇이 걸렸는지는 잡은 뒤에 알 수 있어요. 물고기 40종을 도감에 모으고, 초대 링크로 친구와 같은 호수에서 함께 낚을 수 있어요."
motivation: "느긋하게 던지고 기다리는 낚시의 결을 브라우저에서 바로 즐기고 싶었어요. 설치 없이 열리고, 서버가 없어도 혼자 할 수 있고, 친구를 부르면 같은 호수에 모이는 가벼운 멀티플레이까지 붙였어요. Three.js로 3D 장면을 직접 꾸미고, 던지기부터 당겨 올리는 손맛, 도감 수집까지 하나씩 만든 프로젝트예요."
features:
  - { icon: "🎣", title: "던지고 기다렸다 당기기", desc: "포물선으로 던지고 찌가 잠기면 1초 안에 탭해 입질을 잡아요. 무엇이 걸렸는지는 올린 뒤 결과 카드에서 공개돼요." }
  - { icon: "🎚️", title: "타이밍 낚시 바", desc: "누르면 초록 칸이 오른쪽으로, 떼면 왼쪽으로. 물고기를 칸 안에 붙잡아 게이지를 채우면 성공이에요. 등급이 높을수록 칸은 작고 물고기는 빨라요." }
  - { icon: "📖", title: "물고기 40종 도감", desc: "흔함부터 전설까지 다섯 등급의 물고기 40종을 모아요. 눈 모자 고등어나 산타붕어 같은 겨울 테마가 가득해요." }
  - { icon: "🔗", title: "같은 호수에 친구 초대", desc: "초대 링크를 보내면 같은 서버로 바로 들어와요. 서버가 없으면 혼자 하기로도 매끄럽게 돌아가요." }
notes:
  - { title: "빌드 없는 3D", desc: "Three.js를 importmap으로 불러와 빌드 과정 없이 정적 호스팅(GitHub Pages)에 그대로 올려요. 펭귄 캐릭터와 로비, 서버는 눈싸움 게임과 함께 쓰는 shared 폴더로 공유해요." }
  - { title: "손맛을 더하는 작은 장치", desc: "입질 순간 지원 기기에서는 진동을 주고(음소거 시 꺼짐), 도감과 점수는 브라우저에 저장돼 다시 들어와도 이어져요." }
  - { title: "가벼운 실시간 동기화", desc: "멀티플레이는 찌 위치와 점수, '누가 무엇을 낚았어요' 알림 정도만 주고받아, 서버 부담을 줄이고 혼자 하기로도 자연스럽게 떨어지게 했어요." }
---

## 해보기

<p class="play-cta"><a href="https://wyszkd93.github.io/Game/fishing/" target="_blank" rel="noopener noreferrer">▶ 바로 플레이하기</a></p>

시작 화면에서 닉네임을 넣고 펭귄 색을 고른 뒤, 서버를 선택하면 친구와 함께, "혼자 하기"를 누르면 바로 나 혼자 낚시를 시작해요. 화면을 클릭해 이동하고, 스페이스(길게)로 보는 쪽에 던져요.

- 기술: 프레임워크 없는 바닐라 JavaScript에 Three.js로 3D 장면, 멀티플레이는 Cloudflare Workers(WebSocket). 빌드 없이 importmap으로 로드
- 같은 저장소에 눈싸움 게임이 함께 있고, 펭귄과 로비, 서버 코드를 공유해요
