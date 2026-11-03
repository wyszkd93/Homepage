// 견생 한 바퀴의 픽셀 장면: 사는 곳 배경 + 계절 + 가족 + 걸어 다니는 강아지.
// 240×110 작은 캔버스에 그리고 CSS로 확대합니다(image-rendering: pixelated).
import type { Dog, Place } from './dog-life';

export const SW = 240;
export const SH = 110;
const GROUND = 96; // 발이 닿는 높이

// 견종별 털색·귀·몸 모양
type Coat = { main: string; dark: string; light: string; ear: 'up' | 'down'; long?: boolean; short?: boolean; fluffy?: boolean; head?: string };
const COATS: Record<string, Coat> = {
  maltese: { main: '#f7f4ec', dark: '#d8d0c2', light: '#ffffff', ear: 'down', fluffy: true },
  poodle: { main: '#b9824f', dark: '#8a5a32', light: '#d29b67', ear: 'down', fluffy: true },
  pomeranian: { main: '#e9a456', dark: '#c27b33', light: '#f7d8ac', ear: 'up', fluffy: true },
  mix: { main: '#c99c66', dark: '#8d6538', light: '#eedcbe', ear: 'down' },
  shihtzu: { main: '#f2ece2', dark: '#9a744e', light: '#ffffff', ear: 'down', fluffy: true, head: '#b98b5e' },
  chihuahua: { main: '#e3b17b', dark: '#b5814c', light: '#f6deba', ear: 'up' },
  bichon: { main: '#fbfaf6', dark: '#ddd6cb', light: '#ffffff', ear: 'down', fluffy: true },
  jindo: { main: '#d8a456', dark: '#a8763a', light: '#f3ddb4', ear: 'up' },
  corgi: { main: '#dc8c3f', dark: '#a8611f', light: '#fbf1e2', ear: 'up', long: true, short: true },
  shiba: { main: '#d5853f', dark: '#9e5b22', light: '#f7e7d0', ear: 'up' },
  yorkie: { main: '#7d7a80', dark: '#4b4850', light: '#d4a768', ear: 'up', head: '#d4a768' },
  dachshund: { main: '#8f4c24', dark: '#5e2e12', light: '#bb7642', ear: 'down', long: true, short: true },
  golden: { main: '#e0aa5c', dark: '#b47b33', light: '#f4d59e', ear: 'down' },
  labrador: { main: '#e9d09c', dark: '#c4a56b', light: '#f7ead0', ear: 'down' },
};

// 가족 구성 → 픽셀 사람들, 사는 곳 → 배경
type Person = { hair: string; shirt: string; pants: string; h: number; elder?: boolean };
const SKIN = '#f1c9a5';
const FAMILY_SCENE: Record<string, { people: Person[] }> = {
  single: { people: [{ hair: '#3b2a20', shirt: '#4f7cc4', pants: '#2f3442', h: 16 }] },
  couple: { people: [{ hair: '#2b211b', shirt: '#7a9e7e', pants: '#3a3f4b', h: 16 }, { hair: '#5a3a26', shirt: '#e08a8a', pants: '#4a4f63', h: 15 }] },
  kids: {
    people: [
      { hair: '#2b211b', shirt: '#4f7cc4', pants: '#2f3442', h: 16 }, { hair: '#4a2f22', shirt: '#d9a24b', pants: '#4a4f63', h: 15 },
      { hair: '#2b211b', shirt: '#e06666', pants: '#3b5ba5', h: 10 }, { hair: '#4a2f22', shirt: '#8e7cc3', pants: '#c27ba0', h: 9 },
    ],
  },
  grand: { people: [{ hair: '#d9d9d9', shirt: '#8a6f5a', pants: '#4b4b4b', h: 15, elder: true }, { hair: '#e6e6e6', shirt: '#b56576', pants: '#5a5a6a', h: 14, elder: true }] },
  student: { people: [{ hair: '#1f1f1f', shirt: '#f2c14e', pants: '#3a4a6b', h: 16 }] },
  farm: {
    people: [{ hair: '#3b2a20', shirt: '#6a994e', pants: '#3a3f4b', h: 16 }, { hair: '#5a3a26', shirt: '#e9c46a', pants: '#4a4f63', h: 15 }, { hair: '#dcdcdc', shirt: '#9c6644', pants: '#4b4b4b', h: 14, elder: true }],
  },
  shop: { people: [{ hair: '#3b2a20', shirt: '#f4f1ea', pants: '#6b4a32', h: 16 }, { hair: '#5a3a26', shirt: '#e8b04b', pants: '#4a4f63', h: 15 }] },
  mom: { people: [{ hair: '#4a2f22', shirt: '#9b72cf', pants: '#3a3f4b', h: 15 }, { hair: '#2b211b', shirt: '#f28482', pants: '#4a6fa5', h: 11 }] },
  share: { people: [{ hair: '#2b211b', shirt: '#43aa8b', pants: '#2f3442', h: 16 }, { hair: '#1f1f1f', shirt: '#577590', pants: '#3a3f4b', h: 16 }, { hair: '#7a4a2a', shirt: '#f9844a', pants: '#4a4f63', h: 15 }] },
  artist: { people: [{ hair: '#1f1f1f', shirt: '#e07a5f', pants: '#3d405b', h: 16 }] },
};
export const homeOf = (d: Dog) => d.home?.name ?? '집';
export const coatName = (breedId: string) =>
  ({ maltese: '하양', poodle: '갈색', pomeranian: '오렌지', mix: '크림 갈색', shihtzu: '하양·갈색', chihuahua: '황갈색', bichon: '하양', jindo: '황구', corgi: '레드·하양', shiba: '적갈색', yorkie: '블루·탄', dachshund: '초콜릿', golden: '골드', labrador: '옐로' })[breedId] ?? '갈색';

type Season = 0 | 1 | 2 | 3; // 봄 여름 가을 겨울
const SKY: Record<Season, [string, string]> = { 0: ['#bfe3f5', '#eaf6fb'], 1: ['#8fd0f2', '#d9f0fb'], 2: ['#f3d2a8', '#fbeedd'], 3: ['#cfd9e3', '#eef2f6'] };
const GRASS: Record<Season, [string, string]> = { 0: ['#8cc97a', '#6aa85a'], 1: ['#5fb05a', '#47904a'], 2: ['#c9a85a', '#a8873f'], 3: ['#f4f7fa', '#d7e0e8'] };
export const SEASON_NAME = ['봄', '여름', '가을', '겨울'];

const px = (ctx: CanvasRenderingContext2D, c: string, x: number, y: number, w = 1, h = 1) => {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};

export class DogScene {
  private ctx: CanvasRenderingContext2D;
  private dog: Dog | null = null;
  private x = 150;
  private dir = 1;
  private target = 180;
  private pause = 0;
  private bubble: { icon: string; until: number } | null = null;
  private particles: { x: number; y: number; vx: number; vy: number }[] = [];
  private clouds = [{ x: 20, y: 14, w: 22 }, { x: 120, y: 8, w: 30 }, { x: 200, y: 20, w: 18 }];
  private last = 0;
  ended = false;

  constructor(private canvas: HTMLCanvasElement) {
    canvas.width = SW;
    canvas.height = SH;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;
  }

  setDog(d: Dog) {
    this.dog = d;
    this.x = 150;
    this.dir = 1;
    this.ended = false;
    this.bubble = null;
    this.particles = [];
  }

  say(icon: string, now = performance.now()) {
    this.bubble = { icon, until: now + 2200 };
  }

  /** age: 나이(년), moving: 시간이 흐르는 중인지 */
  frame(now: number, age: number, moving: boolean) {
    const dt = Math.min(0.1, (now - (this.last || now)) / 1000);
    this.last = now;
    const d = this.dog;
    const ctx = this.ctx;
    const season = (Math.floor(((age % 1) + 1) * 4) % 4) as Season; // 1년 = 봄→여름→가을→겨울
    const place: Place = d?.home?.place ?? 'city';

    // 하늘
    const [s1, s2] = SKY[season];
    const g = ctx.createLinearGradient(0, 0, 0, GROUND);
    g.addColorStop(0, s1);
    g.addColorStop(1, s2);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SW, SH);
    // 해
    px(ctx, season === 2 ? '#f6b26b' : '#ffe08a', 214, 10, 8, 8);
    // 구름
    for (const c of this.clouds) {
      c.x += (moving ? 6 : 2) * dt;
      if (c.x > SW + 10) c.x = -c.w - 10;
      px(ctx, '#ffffff', c.x, c.y, c.w, 4);
      px(ctx, '#ffffff', c.x + 4, c.y - 3, c.w - 10, 3);
    }

    this.drawPlace(place, season);

    // 땅
    const [g1, g2] = GRASS[season];
    px(ctx, g1, 0, GROUND, SW, SH - GROUND);
    for (let i = 0; i < SW; i += 6) px(ctx, g2, i + ((i / 6) % 2) * 2, GROUND + 3 + ((i / 6) % 3) * 3, 2, 1);
    if (place === 'sea') {
      px(ctx, '#ead7a8', 0, GROUND, SW, SH - GROUND); // 모래사장
      for (let i = 0; i < SW; i += 9) px(ctx, '#d9c08a', i + ((i / 9) % 2) * 3, GROUND + 4 + ((i / 9) % 3) * 3, 2, 1);
    } else if (place === 'city') {
      px(ctx, '#b9b4ad', 0, GROUND + 6, SW, 8); // 산책로
      for (let i = 0; i < SW; i += 14) px(ctx, '#d6d1ca', i, GROUND + 9, 7, 1);
    } else {
      px(ctx, '#d9b98a', 0, GROUND + 7, SW, 6); // 흙길
    }

    // 계절 효과 (꽃잎·낙엽·눈)
    if (season !== 1) {
      if (this.particles.length < 18 && Math.random() < 0.3) this.particles.push({ x: Math.random() * SW, y: -2, vx: (Math.random() - 0.5) * 8, vy: 10 + Math.random() * 10 });
    }
    const pc = season === 0 ? '#f6b8c8' : season === 2 ? '#d9822b' : '#ffffff';
    this.particles = this.particles.filter((p) => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (season !== 1) px(ctx, pc, p.x, p.y, season === 3 ? 1 : 2, 1);
      return p.y < GROUND + 10;
    });

    // 가족
    // 기본 가족 - 떠난 사람 + 새로 생긴 가족
    const base = d ? FAMILY_SCENE[d.family.id]?.people ?? [] : [];
    const EXTRA: Record<string, Person> = {
      adult: { hair: '#4a2f22', shirt: '#c97b63', pants: '#3a3f4b', h: 15 },
      child: { hair: '#2b211b', shirt: '#7fb3d5', pants: '#4a4f63', h: 10 },
      baby: { hair: '#6b4a32', shirt: '#f7d6e0', pants: '#f7d6e0', h: 7 },
    };
    const people = d
      ? [...base.slice(0, Math.max(1, base.length - d.household.away)), ...d.household.extra.map((k) => EXTRA[k])]
      : [];
    // 사람은 1.7배로 그려서 강아지보다 확실히 크게
    people.forEach((p, i) => {
      ctx.save();
      const PS = 1.7;
      ctx.translate(14 + i * (people.length > 4 ? 16 : 20), GROUND);
      ctx.scale(PS, PS);
      ctx.translate(0, -GROUND);
      this.drawPerson(p, 0, now, i);
      ctx.restore();
    });

    // 강아지
    if (d) {
      const stage = age < 1 ? 0 : age < d.lifespan * 0.6 ? 1 : 2;
      const speed = moving && !this.ended ? (stage === 2 ? 10 : stage === 0 ? 22 : 26) : 0;
      if (speed) {
        if (this.pause > 0) this.pause -= dt;
        else {
          this.x += this.dir * speed * dt;
          if ((this.dir > 0 && this.x >= this.target) || (this.dir < 0 && this.x <= this.target)) {
            this.dir = -this.dir as 1 | -1;
            this.target = this.dir > 0 ? 150 + Math.random() * 70 : 80 + Math.random() * 40;
            this.pause = Math.random() * 1.2;
          }
        }
      }
      const walking = speed > 0 && this.pause <= 0;
      // 동생 강아지는 조금 뒤에서 따라 걸어요
      // (마지막 장면에서 지난 시절을 다시 보여 줄 때는 동생이 오기 전엔 안 그려요)
      if (d.sibling && age >= (d.siblingAt ?? 0)) {
        const sx = this.x - this.dir * 22;
        // 온 지 1년 안 된 동생은 아기 강아지 크기로 그려요
        const sibStage = age - (d.siblingAt ?? 0) < 1 ? 0 : 1;
        this.drawDog({ ...d, breed: d.sibling }, sx, GROUND, sibStage, walking, now + 70);
      }
      this.drawDog(d, this.x, GROUND, stage, walking, now);
      if (this.bubble && now < this.bubble.until) this.drawBubble(this.bubble.icon, this.x, stage);
    }

    if (this.ended) {
      // 무지개
      const cols = ['#f4a7a7', '#f8cf8b', '#f9ef9a', '#b5e3a1', '#a7cdf4', '#c6b3ef'];
      cols.forEach((c, i) => {
        ctx.strokeStyle = c;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(170, 70, 46 - i * 2, Math.PI, 2 * Math.PI);
        ctx.stroke();
      });
    }
  }

  private drawPlace(place: Place, season: Season) {
    const ctx = this.ctx;
    if (place === 'city') {
      const blds = [[6, 34, 26, '#c9d3dc'], [36, 46, 20, '#b7c3cf'], [60, 26, 30, '#d3dbe2'], [96, 40, 22, '#bfcad4'], [196, 30, 28, '#c4cfd9'], [226, 44, 14, '#b3bfcb']] as const;
      for (const [x, h, w, c] of blds) {
        px(ctx, c, x, GROUND - h, w, h);
        for (let wy = GROUND - h + 4; wy < GROUND - 4; wy += 6) for (let wx = x + 3; wx < x + w - 3; wx += 5) px(ctx, '#eef3f7', wx, wy, 2, 3);
      }
      // 가로등·나무
      px(ctx, '#6b6b6b', 130, GROUND - 24, 1, 24);
      px(ctx, '#ffe08a', 128, GROUND - 26, 5, 2);
      this.drawTree(160, season);
    } else if (place === 'sea') {
      // 바다 + 작은 집 + 등대
      px(ctx, season === 3 ? '#9fb8c9' : '#6fb3d9', 0, GROUND - 22, SW, 22);
      for (let x = 0; x < SW; x += 10) px(ctx, '#e6f4fb', x + ((this.last / 300) % 10), GROUND - 16 + ((x / 10) % 3) * 5, 4, 1);
      px(ctx, '#f2e6d0', 18, GROUND - 20, 30, 20);
      px(ctx, '#3d6fa5', 14, GROUND - 24, 38, 4);
      px(ctx, '#8a5a3b', 30, GROUND - 10, 6, 10);
      px(ctx, '#a7cdf4', 21, GROUND - 16, 5, 4);
      px(ctx, '#f4f1ea', 214, GROUND - 40, 8, 40); // 등대
      px(ctx, '#d9534f', 214, GROUND - 32, 8, 4);
      px(ctx, '#d9534f', 214, GROUND - 20, 8, 4);
      px(ctx, '#ffe08a', 215, GROUND - 44, 6, 4);
      px(ctx, '#8a5a3b', 150, GROUND - 18, 14, 3); // 고깃배
      px(ctx, '#6b4428', 152, GROUND - 15, 10, 1);
      px(ctx, '#f4f1ea', 156, GROUND - 27, 1, 9);
      px(ctx, '#f4f1ea', 157, GROUND - 26, 4, 5);
    } else if (place === 'hanok') {
      // 기와지붕 한옥 + 돌담
      px(ctx, '#efe3cf', 18, GROUND - 22, 56, 22);
      ctx.fillStyle = '#4a4f5a';
      ctx.beginPath();
      ctx.moveTo(8, GROUND - 22);
      ctx.quadraticCurveTo(46, GROUND - 30, 84, GROUND - 22);
      ctx.lineTo(74, GROUND - 34);
      ctx.quadraticCurveTo(46, GROUND - 38, 18, GROUND - 34);
      ctx.closePath();
      ctx.fill();
      for (let x = 22; x < 72; x += 10) px(ctx, '#8a5a3b', x, GROUND - 22, 1, 22); // 기둥
      px(ctx, '#c9a26a', 18, GROUND - 6, 56, 2); // 툇마루
      for (let x = 92; x < SW; x += 7) px(ctx, '#a39e94', x, GROUND - 7 + ((x / 7) % 2), 6, 7 - ((x / 7) % 2)); // 돌담
      this.drawTree(200, season);
    } else if (place === 'house') {
      px(ctx, '#f2e6d0', 20, GROUND - 26, 44, 26); // 집
      ctx.fillStyle = '#b5523b';
      ctx.beginPath();
      ctx.moveTo(14, GROUND - 26);
      ctx.lineTo(42, GROUND - 44);
      ctx.lineTo(70, GROUND - 26);
      ctx.fill();
      px(ctx, '#8a5a3b', 36, GROUND - 14, 8, 14);
      px(ctx, '#a7cdf4', 24, GROUND - 20, 8, 6);
      px(ctx, '#a7cdf4', 50, GROUND - 20, 8, 6);
      for (let x = 74; x < SW; x += 6) px(ctx, '#e8dcc6', x, GROUND - 8, 2, 8); // 울타리
      px(ctx, '#e8dcc6', 74, GROUND - 6, SW - 74, 1);
      this.drawTree(206, season);
    } else {
      ctx.fillStyle = season === 3 ? '#e6edf2' : '#9bc58a';
      ctx.beginPath();
      ctx.ellipse(60, GROUND, 90, 26, 0, Math.PI, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = season === 3 ? '#dbe4ea' : '#86b675';
      ctx.beginPath();
      ctx.ellipse(190, GROUND, 80, 20, 0, Math.PI, 2 * Math.PI);
      ctx.fill();
      px(ctx, '#c0492b', 196, GROUND - 24, 30, 24); // 헛간
      px(ctx, '#f2e6d0', 206, GROUND - 14, 10, 14);
      this.drawTree(150, season);
      this.drawTree(20, season);
    }
  }

  private drawTree(x: number, season: Season) {
    const ctx = this.ctx;
    px(ctx, '#7a5236', x, GROUND - 14, 3, 14);
    const leaf = season === 0 ? '#f4b6c8' : season === 1 ? '#4e9a4b' : season === 2 ? '#e0913b' : '#eef3f6';
    px(ctx, leaf, x - 7, GROUND - 26, 17, 12);
    px(ctx, leaf, x - 4, GROUND - 31, 11, 5);
  }

  private drawPerson(p: Person, x: number, now: number, i: number) {
    const ctx = this.ctx;
    const bob = Math.round(Math.sin(now / 500 + i) * 0.5);
    const top = GROUND - p.h + bob;
    const head = p.h > 12 ? 5 : 4;
    px(ctx, p.pants, x + 1, GROUND - Math.round(p.h * 0.35), 2, Math.round(p.h * 0.35));
    px(ctx, p.pants, x + 4, GROUND - Math.round(p.h * 0.35), 2, Math.round(p.h * 0.35));
    px(ctx, p.shirt, x, top + head, 7, Math.round(p.h * 0.65) - head + 1);
    px(ctx, SKIN, x + 1, top, 5, head);
    px(ctx, p.hair, x + 1, top - 1, 5, 2);
    px(ctx, '#2b211b', x + 2, top + 2, 1, 1);
    px(ctx, '#2b211b', x + 4, top + 2, 1, 1);
    if (p.elder) px(ctx, '#7a5236', x + 8, top + head, 1, p.h - head); // 지팡이
  }

  private drawDog(d: Dog, cx: number, ground: number, stage: number, walking: boolean, now: number) {
    const ctx = this.ctx;
    const c = COATS[d.breed.id] ?? COATS.mix;
    const s = stage === 0 ? 0.7 : d.breed.size === 'large' ? 1.25 : d.breed.size === 'medium' ? 1.08 : 0.95;
    const bodyL = c.long ? 15 : 11;
    const legH = c.short ? 2 : 3;
    const step = walking ? Math.floor(now / 140) % 2 : 0;
    const hop = walking && !c.short ? (step ? 0 : 1) : 0;
    const tailUp = Math.floor(now / 200) % 2;
    const muzzle = stage === 2 ? '#e4e4e4' : c.light;

    ctx.save();
    ctx.translate(Math.round(cx), ground - hop);
    ctx.scale(this.dir * s, s);
    const W = bodyL + 7;
    ctx.translate(-W / 2, 0);
    const b = -legH - 6; // 몸 윗부분
    // 다리
    const legs = [1, 3, bodyL - 3, bodyL - 1];
    legs.forEach((lx, i) => px(ctx, c.dark, lx + (walking && (i + step) % 2 ? 1 : 0), -legH, 1.6, legH));
    // 몸
    px(ctx, c.main, 0, b, bodyL, 6);
    px(ctx, c.light, 2, b + 4, bodyL - 4, 2);
    if (c.fluffy) px(ctx, c.main, bodyL - 3, b - 1, 4, 2);
    // 꼬리
    px(ctx, c.main, -2, b - (tailUp ? 3 : 2), 2, 3);
    px(ctx, c.light, -3, b - (tailUp ? 4 : 3), 2, 2);
    // 머리
    const hx = bodyL - 2;
    const hy = b - 5;
    px(ctx, c.head ?? c.main, hx, hy, 7, 6);
    px(ctx, muzzle, hx + 5, hy + 3, 3, 3);
    px(ctx, '#2b211b', hx + 7, hy + 3, 1, 1); // 코
    px(ctx, '#2b211b', hx + 4, hy + 2, 1, 1); // 눈
    // 귀
    if (c.ear === 'up') {
      px(ctx, c.dark, hx + 1, hy - 2, 2, 2);
      px(ctx, c.dark, hx + 4, hy - 2, 2, 2);
    } else {
      px(ctx, c.dark, hx, hy + 1, 2, 4);
    }
    if (stage === 2) px(ctx, '#ffffff', hx + 2, hy, 3, 1); // 흰 털
    ctx.restore();
  }

  private drawBubble(icon: string, x: number, stage: number) {
    const ctx = this.ctx;
    const by = GROUND - (stage === 0 ? 26 : 32);
    const bx = Math.max(12, Math.min(SW - 12, Math.round(x)));
    px(ctx, '#ffffff', bx - 9, by - 9, 18, 16);
    px(ctx, '#2b211b', bx - 9, by - 10, 18, 1);
    px(ctx, '#2b211b', bx - 9, by + 7, 18, 1);
    px(ctx, '#2b211b', bx - 10, by - 9, 1, 16);
    px(ctx, '#2b211b', bx + 9, by - 9, 1, 16);
    px(ctx, '#ffffff', bx - 1, by + 7, 3, 3);
    // 기기에 따라 합성 이모지가 두 글자로 넓게 그려질 수 있어서, 말풍선 안(14px)에 들어가게 줄입니다.
    ctx.font = '12px sans-serif';
    const w = ctx.measureText(icon).width;
    if (w > 14) ctx.font = `${Math.max(6, Math.floor((12 * 14) / w))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, bx, by - 1);
  }
}
