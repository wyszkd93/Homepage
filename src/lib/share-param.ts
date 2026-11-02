// 공유 링크(?r=...)에 결과를 담고 꺼냅니다. JSON → UTF-8 → base64url.
// 암호화가 아니라 주소를 짧고 덜 눈에 띄게 하는 정도입니다.
export function encodeResult(data: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeResult<T = Record<string, unknown>>(v: string | null): T | null {
  if (!v) return null;
  try {
    const bin = atob(v.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const data = JSON.parse(new TextDecoder().decode(bytes));
    return data && typeof data === 'object' ? (data as T) : null;
  } catch {
    return null;
  }
}

/** 주소창에서 공유 표시(r, from)를 지웁니다. */
export function clearShareParams() {
  const p = new URLSearchParams(location.search);
  if (!p.has('r') && !p.has('from')) return;
  p.delete('r');
  p.delete('from');
  const qs = p.toString();
  history.replaceState(null, '', location.pathname + (qs ? `?${qs}` : '') + location.hash);
}
