// 게임 점수 공유 카드(800x800 PNG). 위에는 게임 그림, 아래에는 점수를 크게 보여 줍니다.
export interface ScoreCard {
  title: string; // 게임 이름
  score: number;
  best?: number | null; // 내 최고 기록 (로그인했을 때)
  rank?: number | null; // 내 순위 (로그인했을 때)
  name?: string; // 닉네임
  art?: string; // 같은 사이트의 게임 그림 주소
}

const FONT = "'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif";

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function drawScoreCard(c: ScoreCard): Promise<Blob | null> {
  try { await document.fonts?.ready; } catch {}
  const W = 800;
  const IH = 500; // 그림 높이
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = W;
  const ctx = cv.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#fffaf4';
  ctx.fillRect(0, 0, W, W);

  // 위: 게임 그림 (가로로 꽉 차게, 조금 위쪽 기준으로 잘라 냄)
  const img = c.art ? await loadImage(c.art) : null;
  if (img) {
    const sw = img.naturalWidth;
    const sh = Math.min(img.naturalHeight, (sw * IH) / W);
    const sy = Math.max(0, (img.naturalHeight - sh) * 0.35);
    ctx.drawImage(img, 0, sy, sw, sh, 0, 0, W, IH);
  } else {
    const g = ctx.createLinearGradient(0, 0, W, IH);
    g.addColorStop(0, '#ffe9d2');
    g.addColorStop(1, '#e3f1ef');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, IH);
  }

  // 아래: 점수 패널
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#c0632f';
  ctx.font = `700 30px ${FONT}`;
  ctx.fillText(`🎮 ${c.title}`, W / 2, 548, W - 120);

  const num = c.score.toLocaleString('ko-KR');
  ctx.font = `900 104px ${FONT}`;
  const nw = ctx.measureText(num).width;
  ctx.font = `800 40px ${FONT}`;
  const uw = ctx.measureText('점').width;
  const x0 = (W - (nw + 10 + uw)) / 2;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#2b2420';
  ctx.font = `900 104px ${FONT}`;
  ctx.fillText(num, x0, 630);
  ctx.font = `800 40px ${FONT}`;
  ctx.fillText('점', x0 + nw + 10, 652);
  ctx.textAlign = 'center';

  const sub: string[] = [];
  if (c.name) sub.push(c.name);
  if (c.best != null && c.best > 0) sub.push(`내 최고 ${c.best.toLocaleString('ko-KR')}점`);
  if (c.rank) sub.push(`${c.rank.toLocaleString('ko-KR')}위`);
  ctx.fillStyle = '#7a6f67';
  ctx.font = `600 26px ${FONT}`;
  ctx.fillText(sub.length ? sub.join(' · ') : '나를 이길 수 있을까요?', W / 2, 714, W - 120);

  ctx.fillStyle = '#a69a90';
  ctx.font = `500 18px ${FONT}`;
  ctx.fillText('wyszkd93.github.io/Homepage · 쉬어가기', W / 2, 764);

  return new Promise((resolve) => {
    try {
      cv.toBlob((b) => resolve(b), 'image/png');
    } catch {
      resolve(null); // 그림을 다른 주소에서 불러와 캔버스를 내보낼 수 없는 경우
    }
  });
}
