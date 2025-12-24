import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { theme } from '../styles/theme';
import { common } from '../styles/common';
import { cafeFindStyles } from '../styles/cafeFindStyles';
import CafeListItem from '../components/CafeListItem';
import { useCurrentPosition } from '../hooks/useCurrentPosition';
import { useNearCafe } from '../hooks/useNearCafe';
import type { MapCafe } from '../api/cafes';
import KakaoMap from '../components/map/KakaoMap';

// 기본 위치 (서울 중심 - 서울시청) - GPS 위치를 가져오지 못할 때 사용
const DEFAULT_COORDS = { lat: 37.5665, lng: 126.978 };

export default function CafeFindScreen() {
  const { coords: gpsCoords, error } = useCurrentPosition();
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // 지도 중심 위치를 우선 사용, 없으면 기본 위치 사용 (GPS 무시)
  const searchCoords = mapCenter || DEFAULT_COORDS;
  const displayCoords = DEFAULT_COORDS; // 지도 표시용 좌표 (항상 기본 위치)

  const {
    data: cafes = [],
    isLoading,
    error: apiError,
  } = useNearCafe(searchCoords || undefined);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  // 지도 중심 변경 핸들러 (디바운스 적용)
  const handleCenterChanged = (coords: { lat: number; lng: number }) => {
    // 이전 타이머 취소
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 디바운스: 500ms 후에 위치 업데이트
    debounceTimerRef.current = setTimeout(() => {
      setMapCenter(coords);
      console.log('🗺️ [지도화면] 지도 중심 변경:', coords);
    }, 500);
  };

  // API 상태 확인 로그
  useEffect(() => {
    console.log(' [지도화면] GPS 위치:', gpsCoords);
    console.log(' [지도화면] 검색 위치:', searchCoords);
    console.log('[지도화면] 카페 데이터:', cafes.length, '개');
    console.log(' [지도화면] 로딩 중:', isLoading);
    if (apiError) {
      // NOTE: RN 개발 모드에서 console.error는 RedBox(오버레이)를 띄울 수 있어 warn으로 낮춥니다.
      console.warn(' [지도화면] API 에러:', apiError);
    }
    if (cafes.length > 0) {
      console.log('[지도화면] 카페 목록:', cafes);
    }
  }, [gpsCoords, searchCoords, cafes, isLoading, apiError]);

  // 에러가 있어도 기본 위치로 지도는 표시
  // if (error) {
  //   return (
  //     <View style={common.screen}>
  //       <Text>{error}</Text>
  //     </View>
  //   );
  // }

  // GPS 위치가 없어도 기본 위치로 지도 표시
  // if (!gpsCoords) {
  //   return (
  //     <View style={common.screen}>
  //       <Text>현재 위치를 가져오는 중입니다…</Text>
  //     </View>
  //   );
  // }

  /*  // 더미 데이터
  const progressStep = 3; // 총 5단계 중 3단계 완료
  const searchLocation = '동대입구역';
  image.png 
  const cafes = [
    {
      id: '1',
      name: '스타벅스 동대입구역점',
      status: '영업 중',
      image: 'star', // 임시로 아이콘 사용
    },
  ]; */

  return (
    <View style={common.screen}>
      {/* 지도 영역 */}
      <View style={cafeFindStyles.mapContainer}>
        <KakaoMap
          userCoords={displayCoords}
          cafes={cafes}
          onMarkerPress={cafe => setSelectedId(String(cafe.id))}
          onCenterChanged={handleCenterChanged}
        />
      </View>

      <View style={cafeFindStyles.bottomSheet}>
        {/* Handle */}
        <View style={cafeFindStyles.handle} />

        {/* 헤더 */}
        <View style={cafeFindStyles.header}>
          <Text style={cafeFindStyles.title}>주변 카페 찾기</Text>
          <Text style={cafeFindStyles.subtitle}>
            {gpsCoords
              ? '현재 위치 기준 검색 중'
              : error
              ? '기본 위치 기준 검색 (위치 권한 필요)'
              : '기본 위치 기준 검색'}
          </Text>
        </View>

        <ScrollView
          style={cafeFindStyles.content}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <Text>카페 정보를 불러오는 중…</Text>
          ) : (
            cafes.map(cafe => (
              <CafeListItem
                key={cafe.id}
                cafe={{
                  id: String(cafe.id),
                  name: cafe.name,
                  status: cafe.distance
                    ? `${Math.round(cafe.distance)}m`
                    : '거리 계산 중',
                  image: selectedId === String(cafe.id) ? 'pin' : 'cafe',
                }}
                onPress={() => setSelectedId(String(cafe.id))}
              />
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

{
  /* 진행 상태 바 */
}
{
  /*   <View style={cafeFindStyles.progressBar}>
          {[1, 2, 3, 4, 5].map((step) => (
            <View
              key={step}
              style={[
                cafeFindStyles.progressItem,
                step <= progressStep && cafeFindStyles.progressItemActive,
              ]}
            />
          ))}
        </View> */
}

/*  <ScrollView
          style={cafeFindStyles.content}
          showsVerticalScrollIndicator={false}> */
{
  /* 메뉴 찾기 카드 */
}
{
  /* <View style={cafeFindStyles.menuCard}>
            <View style={cafeFindStyles.menuCardIcon}>
              <Ionicons name="cafe-outline" size={24} color={theme.colors.primary} />
            </View>
            <View style={cafeFindStyles.menuCardContent}>
              <Text style={cafeFindStyles.menuCardTitle}>
                어떤 메뉴를 찾고 계신가요?
              </Text>
              <Text style={cafeFindStyles.menuCardSubtitle}>
                사용자의 위치를 기반으로 주변 카페를 추천합니다.
              </Text>
            </View>
          </View> */
}

{
  /* 카페 리스트 */
}
{
  /*    <View style={cafeFindStyles.cafeList}>
            {cafes.map((cafe) => (
              <CafeListItem key={cafe.id} cafe={cafe} />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
} */
}
