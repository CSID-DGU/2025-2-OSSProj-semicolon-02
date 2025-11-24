//GeoLocation 권한 요청, 위/경도 상태 관리
import { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';

type Coords = { lat: number; lng: number };

export const useCurrentPosition = () => {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Geolocation.requestAuthorization?.();
    const watchId = Geolocation.watchPosition(
      pos => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => setError(err.message),
      { enableHighAccuracy: true, distanceFilter: 10 },
    );
    return () => Geolocation.clearWatch(watchId);
  }, []);

  return { coords, error };
};




