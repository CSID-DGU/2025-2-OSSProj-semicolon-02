import React from 'react';
import { Dimensions, View, StyleSheet, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');

// 탭바 총 높이와 노치(파인 부분) 크기 조절 지점
const TAB_HEIGHT = 70;
const NOTCH_RADIUS = 34;     // + 버튼 반지름보다 살짝 크게
const NOTCH_WIDTH = NOTCH_RADIUS * 2 + 12; // 양쪽 여유
const TOP_RADIUS = 22;       // 상단 모서리 라운드

export default function TabBarBackground() {
  // Path: 화면 폭
  const centerX = width / 2;
  const leftX = 0;
  const rightX = width;

  // 윗선 y 좌표 (둥근 모서리 시각 보정)
  const topY = 8;

  // 노치 좌우 시작점
  const notchLeft = centerX - NOTCH_WIDTH / 2;
  const notchRight = centerX + NOTCH_WIDTH / 2;

  // 곡선의 높이(얼마나 패일지)
  const notchDepth = 24;

  const d = [
    // 좌측 상단 라운드
    `M ${leftX} ${TAB_HEIGHT}`,
    `L ${leftX} ${topY + TOP_RADIUS}`,
    `Q ${leftX} ${topY} ${leftX + TOP_RADIUS} ${topY}`,
    // 노치 왼쪽까지 직선
    `L ${notchLeft - 14} ${topY}`,
    // 노치 진입 곡선 
    `C ${notchLeft - 6} ${topY} ${notchLeft - 6} ${topY} ${notchLeft} ${topY + 6}`,
    // 노치 바닥쪽 곡선
    `C ${notchLeft + 6} ${topY + notchDepth} ${notchRight - 6} ${topY + notchDepth} ${notchRight} ${topY + 6}`,
    // 노치 탈출 곡선
    `C ${notchRight + 6} ${topY} ${notchRight + 6} ${topY} ${notchRight + 14} ${topY}`,
    // 우측 상단 라운드
    `L ${rightX - TOP_RADIUS} ${topY}`,
    `Q ${rightX} ${topY} ${rightX} ${topY + TOP_RADIUS}`,
    // 우측 하단으로 닫기
    `L ${rightX} ${TAB_HEIGHT}`,
    `Z`,
  ].join(' ');

  return (
    <View style={styles.wrap}>
      <Svg width={width} height={TAB_HEIGHT + 12}>
        <Path d={d} fill={theme.colors.surface} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 0,
    // 바닥 카드 느낌의 그림자
    ...theme.shadow.card,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: Platform.select({ android: 10, ios: 0 }),
  },
});
