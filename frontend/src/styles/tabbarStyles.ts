import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const TAB_HEIGHT = 70;

export const tabbarStyles = StyleSheet.create({
  // 실제 바는 투명: 배경은 SVG가 그림
  tabBar: {
    position: 'absolute',
    height: TAB_HEIGHT,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    elevation: 0,
  },

  // 가운데 슬롯(공간만 차지)
  addSlot: {
    width: 82,
  },

  // 아이콘 라벨
  label: {
    fontSize: 11,
    marginBottom: 6,
    color: theme.colors.gray500,
  },

  // 아이콘 간격(노치와 겹침 방지)
  item: {
    paddingTop: 6,
  },

  statisticsItem: {
    marginRight: 90,
  },
});
