// styles/tabbarStyles.ts
import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const TAB_HEIGHT = 70;

export const tabbarStyles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: TAB_HEIGHT,
    backgroundColor: theme.colors.white,
    borderTopWidth: 0,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    overflow: 'hidden',   // 내부 콘텐츠 라운드에 맞춰 자르기
    elevation: 0,         // 안드로이드 기본 그림자 제거
  },

  /** 탭바 위쪽으로만 보이게 할 얕은 그림자 오버레이 */
  shadowOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: TAB_HEIGHT,  
    height: 12,

    // iOS
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },

    // 반투명 보정선
    backgroundColor: 'transparent',
  },

  /** 중앙 + 버튼 자리 확보용 슬롯 */
  addSlot: {
    width: 82,
  },

  /** 아이콘 라벨 */
  label: {
    fontSize: 11,
    marginBottom: 6,
    color: theme.colors.gray500,
  },

  /** 아이콘 간격(원형 FAB와 겹침 방지) */
  item: {
    paddingTop: 6,
  },

  /** 통계 탭만 우측 여백 보정이 필요할 때 사용 */
  statisticsItem: {
    marginRight: 90,
  },
});