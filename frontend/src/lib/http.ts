import axios from 'axios';
import { Platform } from 'react-native';

// 개발 환경별 기본 URL 설정
// Android 에뮬레이터: 10.0.2.2 가 PC의 localhost를 가리킵니다(확실)
// iOS 시뮬레이터: localhost 사용(확실)
// 실기기(Wi-Fi 동일망): PC IP로 교체(예: 192.168.x.y:8080, 확실)
export const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080'
    : 'http://localhost:8080';

// axios 인스턴스
export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// // 요청/응답 인터셉터(필요 시 사용)
// http.interceptors.request.use((config) => {
//   // const token = await SecureStore.getItemAsync('accessToken');
//   // if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });
// http.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     // 에러 로깅/토큰 갱신 등(확실하지 않음)
//     return Promise.reject(err);
//   }
// );
