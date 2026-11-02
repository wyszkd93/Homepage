// 카카오톡 공유 (Kakao JavaScript SDK). 버튼을 처음 누를 때만 SDK를 불러옵니다.
import { KAKAO_JS_KEY } from '../consts';

export const kakaoEnabled = KAKAO_JS_KEY !== '';

type KakaoSDK = {
  isInitialized(): boolean;
  init(key: string): void;
  Share: {
    sendDefault(opts: unknown): void;
    uploadImage(opts: { file: File[] }): Promise<{ infos: { original: { url: string } } }>;
  };
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

export interface ShareItem { item: string; itemOp: string }
export interface ShareOptions {
  title: string;
  description: string;
  buttonTitle?: string;
  /** 카드 아래 목록 (최대 5줄) */
  items?: ShareItem[];
  /** 카드 이미지로 쓸 그림. 카카오 서버에 올린 뒤 사용하고, 실패하면 페이지 대표 그림을 씁니다. */
  image?: () => Promise<Blob | null>;
  /** 카드를 눌렀을 때 공유한 결과를 보여 줄 주소 뒤에 붙일 값 (예: 's=...'). 있으면 '결과 보기'·'나도 해보기' 버튼 두 개 */
  viewQuery?: string;
}

/** 지금 페이지를 카카오톡으로 공유합니다. */
export async function shareKakao(opts: ShareOptions) {
  if (!kakaoEnabled) return;
  const Kakao = await loadSdk();
  if (!Kakao.isInitialized()) Kakao.init(KAKAO_JS_KEY);
  let uploaded: string | null = null;
  if (opts.image) {
    try {
      const blob = await opts.image();
      if (blob) {
        const res = await Kakao.Share.uploadImage({ file: [new File([blob], 'result.png', { type: 'image/png' })] });
        uploaded = res.infos.original.url;
      }
    } catch (e) {
      console.warn('결과 이미지를 올리지 못해 기본 그림을 씁니다.', e);
    }
  }
  const page = location.origin + location.pathname;
  // 카드에서 들어온 사람은 빈 화면에서 시작하도록 표시를 붙입니다.
  const url = `${page}?from=kakao`;
  const imageUrl =
    uploaded ??
    document.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content ??
    `${location.origin}/favicon.png`;
  const link = { mobileWebUrl: url, webUrl: url };
  const viewUrl = opts.viewQuery ? `${page}?${opts.viewQuery}` : null;
  const viewLink = viewUrl ? { mobileWebUrl: viewUrl, webUrl: viewUrl } : link;
  Kakao.Share.sendDefault({
    objectType: 'feed',
    content: { title: opts.title, description: opts.description, imageUrl, link: viewLink, ...(uploaded ? { imageWidth: 800, imageHeight: 800 } : {}) },
    ...(opts.items?.length ? { itemContent: { items: opts.items.slice(0, 5) } } : {}),
    buttons: viewUrl
      ? [{ title: '결과 보기', link: viewLink }, { title: opts.buttonTitle ?? '나도 해보기', link }]
      : [{ title: opts.buttonTitle ?? '나도 해보기', link }],
  });
}
