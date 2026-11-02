// 카카오톡 공유 (Kakao JavaScript SDK). 버튼을 처음 누를 때만 SDK를 불러옵니다.
import { KAKAO_JS_KEY } from '../consts';

export const kakaoEnabled = KAKAO_JS_KEY !== '';

type KakaoSDK = {
  isInitialized(): boolean;
  init(key: string): void;
  Share: { sendDefault(opts: unknown): void };
};
declare global {
  interface Window { Kakao?: KakaoSDK }
}

const SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
let loading: Promise<KakaoSDK> | null = null;

function loadSdk(): Promise<KakaoSDK> {
  if (window.Kakao) return Promise.resolve(window.Kakao);
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SDK_URL;
    s.crossOrigin = 'anonymous';
    s.onload = () => (window.Kakao ? resolve(window.Kakao) : reject(new Error('Kakao SDK missing')));
    s.onerror = () => {
      loading = null;
      reject(new Error('Kakao SDK load failed'));
    };
    document.head.appendChild(s);
  });
  return loading;
}

/** 지금 페이지를 카카오톡으로 공유합니다. */
export async function shareKakao(opts: { title: string; description: string; buttonTitle?: string }) {
  if (!kakaoEnabled) return;
  const Kakao = await loadSdk();
  if (!Kakao.isInitialized()) Kakao.init(KAKAO_JS_KEY);
  const url = location.origin + location.pathname;
  const imageUrl =
    document.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content ?? `${location.origin}/favicon.png`;
  const link = { mobileWebUrl: url, webUrl: url };
  Kakao.Share.sendDefault({
    objectType: 'feed',
    content: { title: opts.title, description: opts.description, imageUrl, link },
    buttons: [{ title: opts.buttonTitle ?? '나도 해보기', link }],
  });
}
