// 사주 결과 요약 카드(800x800 PNG)를 캔버스로 그립니다. 카카오톡 공유 카드 이미지로 씁니다.
import {
  type Element, type Pillar, type Saju, ELEMENTS, ELEMENT_KO, ELEMENT_HANJA, STEMS, BRANCHES, STEMS_KO, BRANCHES_KO,
  stemElement, branchElement,
} from './saju';

const COLOR: Record<Element, string> = { wood: '#3f9b5a', fire: '#e0563b', earth: '#c9952a', metal: '#8a8f98', water: '#3b6fd1' };
const FONT = "'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif";
const SERIF = "'Noto Serif KR', 'Apple SD Gothic Neo', 'Noto Sans CJK KR', 'Malgun Gothic', serif";

function tint(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}
function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export interface CardInfo {
  saju: Saju;
  meTitle: string; // 예: 계수(癸水) · 촉촉한 비와 이슬
  meIcon: string;
  summary: string; // 예: 신약 · 재성 중심 · 용신 금
  todayStars: string; // ★★★★☆
}

export async function drawSajuCard(info: CardInfo): Promise<Blob | null> {
  try { await document.fonts?.ready; } catch {}
  const W = 800;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = W;
  const ctx = c.getContext('2d');
  if (!ctx) return null;

  // 배경
  const g = ctx.createLinearGradient(0, 0, W, W);
  g.addColorStop(0, '#fff3e4');
  g.addColorStop(1, '#eef5f4');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, W);
  ctx.fillStyle = '#ffffff';
  rrect(ctx, 36, 36, W - 72, W - 72, 32);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#c0632f';
  ctx.font = `700 26px ${FONT}`;
  ctx.fillText('🔮 모구의 사주 카페', W / 2, 92);
  ctx.fillStyle = '#2b2420';
  ctx.font = `800 40px ${FONT}`;
  ctx.fillText('나의 사주팔자', W / 2, 140);

  // 네 기둥 (시·일·월·년)
  const cols: [string, Pillar | null][] = [['시주', info.saju.hour], ['일주', info.saju.day], ['월주', info.saju.month], ['년주', info.saju.year]];
  const cw = 132, gap = 18, x0 = (W - (cw * 4 + gap * 3)) / 2, top = 186;
  cols.forEach(([label, p], i) => {
    const x = x0 + i * (cw + gap);
    ctx.fillStyle = '#7a6f67';
    ctx.font = `600 20px ${FONT}`;
    ctx.fillText(label, x + cw / 2, top);
    [0, 1].forEach((row) => {
      const y = top + 22 + row * 128;
      const el = p ? (row === 0 ? stemElement(p.stem) : branchElement(p.branch)) : null;
      const col = el ? COLOR[el] : '#b9b0a8';
      ctx.fillStyle = el ? tint(col, 0.13) : '#f4efe9';
      rrect(ctx, x, y, cw, 116, 18);
      ctx.fill();
      ctx.strokeStyle = el ? tint(col, 0.35) : '#e6ddd3';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = col;
      ctx.font = `700 62px ${SERIF}`;
      const ch = p ? (row === 0 ? STEMS[p.stem] : BRANCHES[p.branch]) : '?';
      ctx.fillText(ch, x + cw / 2, y + 50);
      if (p && el) {
        ctx.fillStyle = '#4a403a';
        ctx.font = `600 18px ${FONT}`;
        const ko = row === 0 ? STEMS_KO[p.stem] : BRANCHES_KO[p.branch];
        ctx.fillText(`${ko} · ${ELEMENT_KO[el]}`, x + cw / 2, y + 96);
      }
    });
  });

  // 오행 막대
  const by = 488;
  const maxN = Math.max(1, ...ELEMENTS.map((e) => info.saju.counts[e]));
  const bw = 112, bgap = 14, bx0 = (W - (bw * 5 + bgap * 4)) / 2;
  ELEMENTS.forEach((e, i) => {
    const x = bx0 + i * (bw + bgap);
    const n = info.saju.counts[e];
    ctx.fillStyle = COLOR[e];
    ctx.font = `700 22px ${FONT}`;
    ctx.fillText(`${ELEMENT_HANJA[e]} ${ELEMENT_KO[e]} ${n}`, x + bw / 2, by);
    ctx.fillStyle = '#f1ebe4';
    rrect(ctx, x, by + 22, bw, 14, 7);
    ctx.fill();
    if (n > 0) {
      ctx.fillStyle = COLOR[e];
      rrect(ctx, x, by + 22, Math.max(14, (bw * n) / maxN), 14, 7);
      ctx.fill();
    }
  });

  // 요약
  ctx.fillStyle = '#fff1e4';
  rrect(ctx, 76, 560, W - 152, 146, 22);
  ctx.fill();
  ctx.fillStyle = '#2b2420';
  ctx.font = `800 32px ${FONT}`;
  ctx.fillText(`${info.meIcon} ${info.meTitle}`, W / 2, 604, W - 200);
  ctx.fillStyle = '#4a403a';
  ctx.font = `600 24px ${FONT}`;
  ctx.fillText(info.summary, W / 2, 646, W - 200);
  ctx.fillStyle = '#e09a1a';
  ctx.font = `700 24px ${FONT}`;
  ctx.fillText(`오늘 총운 ${info.todayStars}`, W / 2, 682);

  ctx.fillStyle = '#a69a90';
  ctx.font = `500 18px ${FONT}`;
  ctx.fillText('wyszkd93.github.io/Homepage · 재미로 보는 사주', W / 2, 738);

  return new Promise((resolve) => c.toBlob((b) => resolve(b), 'image/png'));
}
