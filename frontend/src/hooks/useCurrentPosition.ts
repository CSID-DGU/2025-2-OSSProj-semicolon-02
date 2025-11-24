//GeoLocation 권한 요청, 위/경도 상태 관리
import { useEffect, useState, useRef } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid } from 'react-native';

type Coords = { lat: number; lng: number };

export const useCurrentPosition = () => {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: '위치 권한',
              message: '카페 찾기 기능을 위해 위치 권한이 필요합니다.',
              buttonNeutral: '나중에',
              buttonNegative: '취소',
              buttonPositive: '확인',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setError('Location permission was not granted.');
            return;
          }
        } catch (err) {
          setError('Permission request failed.');
          return;
        }
      } else {
        // iOS
        Geolocation.requestAuthorization?.();
      }

      // 권한 승인 후 위치 감시 시작
      watchIdRef.current = Geolocation.watchPosition(
        pos =>
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => setError(err.message),
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    };

    requestLocationPermission();

    // cleanup 함수
    return () => {
      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  return { coords, error };
};
