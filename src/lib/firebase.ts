// Firebase 연결 (게임 랭킹용). 아래 값은 웹 앱용 공개 설정이라 코드에 들어가도 된다.
// 데이터 보호는 저장소 루트의 firestore.rules(콘솔에 게시)가 맡는다.
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore/lite';

const app = initializeApp({
  apiKey: 'AIzaSyDh_zWOe0c_13L-Je2SdUX8Rs58W8QqK9o',
  authDomain: 'mogu-homepage.firebaseapp.com',
  projectId: 'mogu-homepage',
  storageBucket: 'mogu-homepage.firebasestorage.app',
  messagingSenderId: '402397620813',
  appId: '1:402397620813:web:d6d7b3a8ff8f00b3deca04',
});

export const auth = getAuth(app);
export const db = getFirestore(app);

// 로컬 테스트 전용: PUBLIC_FIREBASE_EMULATOR=1 로 빌드했을 때만 에뮬레이터에 붙는다 (배포 빌드에서는 빠짐)
if (import.meta.env.PUBLIC_FIREBASE_EMULATOR === '1') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  // 팝업 없이 로그인하는 테스트용 훅 (에뮬레이터는 서명 없는 가짜 Google 토큰을 받아 줌)
  (window as unknown as Record<string, unknown>).__testSignIn = (sub: string) =>
    signInWithCredential(auth, GoogleAuthProvider.credential(JSON.stringify({ sub, email: `${sub}@example.com`, email_verified: true })));
}
