import { Platform } from 'react-native';

// 실기기에서 테스트 시 PC IP로 교체
//const PC_IP = '192.168.x.x'; 

export const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080'   // AVD(에뮬레이터)가 PC localhost에 접근할 때
    : 'http://localhost:8080'; // iOS 시뮬레이터/웹

// 실기기(Wi-Fi 동일)에서 테스트할 땐 아래처럼 교체
// export const BASE_URL = `http://${PC_IP}:8080`;
