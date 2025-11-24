import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { theme } from '../styles/theme';
import { common } from '../styles/common';
import { cafeFindStyles } from '../styles/cafeFindStyles';
import CafeListItem from '../components/CafeListItem';
import { useCurrentPosition } from '../hooks/useCurrentPosition';
import { useNearCafe } from '../hooks/useNearCafe';
import type { Cafe } from '../api/cafes';
import KakaoMap from '../components/map/KakaoMap';

export default function CafeFindScreen() {
  const { coords, error } = useCurrentPosition();
  const { data: cafes = [], isLoading } = useNearCafe(coords || undefined);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (error) {
    return (
      <View style={common.screen}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!coords) {
    return (
      <View style={common.screen}>
        <Text>현재 위치를 가져오는 중입니다…</Text>
      </View>
    );
  }

  /*  // 더미 데이터
  const progressStep = 3; // 총 5단계 중 3단계 완료
  const searchLocation = '동대입구역';
  
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
          userCoords={coords}
          cafes={cafes}
          onMarkerPress={cafe => setSelectedId(String(cafe.id))}
        />
      </View>

      {/* Bottom Sheet */}
      <View style={cafeFindStyles.bottomSheet}>
        {/* Handle */}
        <View style={cafeFindStyles.handle} />

        {/* 헤더 */}
        <View style={cafeFindStyles.header}>
          <Text style={cafeFindStyles.title}>주변 카페 찾기</Text>
          <Text style={cafeFindStyles.subtitle}>현재 위치 기준 검색 중</Text>
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
