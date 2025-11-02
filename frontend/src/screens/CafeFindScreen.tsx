import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {theme} from '../styles/theme';
import {common} from '../styles/common';
import {cafeFindStyles} from '../styles/cafeFindStyles';
import CafeListItem from '../components/CafeListItem';

export default function CafeFindScreen() {
  // 더미 데이터
  const progressStep = 3; // 총 5단계 중 3단계 완료
  const searchLocation = '동대입구역';
  
  const cafes = [
    {
      id: '1',
      name: '스타벅스 동대입구역점',
      status: '영업 중',
      image: 'star', // 임시로 아이콘 사용
    },
  ];

  return (
    <View style={common.screen}>
      {/* 지도 영역 (임시) */}
      <View style={cafeFindStyles.mapContainer}>
        <Text style={cafeFindStyles.mapPlaceholder}>
          지도 영역 (API 연동 예정)
        </Text>
      </View>

      {/* Bottom Sheet */}
      <View style={cafeFindStyles.bottomSheet}>
        {/* Handle */}
        <View style={cafeFindStyles.handle} />

        {/* 헤더 */}
        <View style={cafeFindStyles.header}>
          <Text style={cafeFindStyles.title}>주변 카페 찾기</Text>
          <Text style={cafeFindStyles.subtitle}>
            {searchLocation}을 중심으로 검색 중입니다.
          </Text>
        </View>

        {/* 진행 상태 바 */}
        <View style={cafeFindStyles.progressBar}>
          {[1, 2, 3, 4, 5].map((step) => (
            <View
              key={step}
              style={[
                cafeFindStyles.progressItem,
                step <= progressStep && cafeFindStyles.progressItemActive,
              ]}
            />
          ))}
        </View>

        <ScrollView
          style={cafeFindStyles.content}
          showsVerticalScrollIndicator={false}>
          {/* 메뉴 찾기 카드 */}
          <View style={cafeFindStyles.menuCard}>
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
          </View>

          {/* 카페 리스트 */}
          <View style={cafeFindStyles.cafeList}>
            {cafes.map((cafe) => (
              <CafeListItem key={cafe.id} cafe={cafe} />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

