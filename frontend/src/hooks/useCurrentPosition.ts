//GeoLocation 권한 요청, 위/경도 상태 관리
import { useEffect, useState, useRef } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid, InteractionManager } from 'react-native';

type Coords = { lat: number; lng: number };

export const useCurrentPosition = () => {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Activity가 준비된 후에 권한 요청
    const interaction = InteractionManager.runAfterInteractions(() => {
      const requestLocationPermission = async () => {
        // 추가로 약간의 지연을 주어 Activity가 완전히 준비되도록 함
        await new Promise<void>(resolve => setTimeout(() => resolve(), 100));

        if (Platform.OS === 'android') {
          try {
            // 먼저 권한이 이미 있는지 확인
            const checkResult = await PermissionsAndroid.check(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );

            if (!checkResult) {
              // 권한 요청
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
                setError(
                  '위치 권한이 필요합니다. 설정에서 위치 권한을 허용해주세요.',
                );
                return;
              }
            }

            // 권한이 있으면 위치 감시 시작
            watchIdRef.current = Geolocation.watchPosition(
              pos =>
                setCoords({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                }),
              err => setError(`위치를 가져오는데 실패했습니다: ${err.message}`),
              {
                enableHighAccuracy: true,
                distanceFilter: 10,
                timeout: 15000,
                maximumAge: 10000,
              },
            );
          } catch (err) {
            console.error('Location permission error:', err);
            const errorMessage =
              err instanceof Error
                ? `권한 요청 실패: ${err.message}`
                : '권한 요청 중 오류가 발생했습니다. 설정에서 위치 권한을 확인해주세요.';
            setError(errorMessage);
            return;
          }
        } else {
          // iOS
          Geolocation.requestAuthorization?.();

          // 권한 승인 후 위치 감시 시작
          watchIdRef.current = Geolocation.watchPosition(
            pos =>
              setCoords({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              }),
            err => setError(`위치를 가져오는데 실패했습니다: ${err.message}`),
            {
              enableHighAccuracy: true,
              distanceFilter: 10,
              timeout: 15000,
              maximumAge: 10000,
            },
          );
        }
      };

      requestLocationPermission();
    });

    // cleanup 함수
    return () => {
      interaction.cancel();
      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  return { coords, error };
};
