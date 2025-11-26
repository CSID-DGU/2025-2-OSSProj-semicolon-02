import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const fonts = {
  regular:  { fontFamily: 'Pretendard-Regular' },
  medium:   { fontFamily: 'Pretendard-Medium' },
  semibold: { fontFamily: 'Pretendard-SemiBold' },
  bold:     { fontFamily: 'Pretendard-Bold' },
  black:    { fontFamily: 'Pretendard-Black' },
};

export const common = StyleSheet.create({
  // 전체 화면 기본
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // 통계 기준으로 여백 확대 (2 → 3)
  container: {
    paddingHorizontal: theme.spacing(3),
    paddingBottom: theme.spacing(6),
  },

  // 행 배치 기본
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // 타이포 계층
  h1: { ...fonts.bold, fontSize: 24, lineHeight: 32, color: theme.colors.text },
  h2: { ...fonts.semibold, fontSize: 18, lineHeight: 26, color: theme.colors.text },
  body: { ...fonts.regular, fontSize: 14, lineHeight: 20, color: theme.colors.text },
  subtle: { ...fonts.regular, fontSize: 13, color: theme.colors.gray500 },

  // 공통 카드
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing(2),
    borderWidth: 1,
    borderColor: theme.colors.line,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  // 섹션 간 간격 통일 (통계는 marginTop: spacing(4))
  section: {
    marginTop: theme.spacing(4),
  },

  // chip/pill류 버튼
  chip: {
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1),
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },

  // 아이콘 버튼 (통계 backButton 기준)
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 공통 그림자
  shadowCard: {
    shadowColor: '#707070ff',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
});
