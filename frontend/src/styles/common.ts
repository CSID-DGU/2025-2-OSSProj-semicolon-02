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
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    paddingHorizontal: theme.spacing(2),
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  h1: { ...fonts.bold, fontSize: 24, lineHeight: 32 },
  h2: { ...fonts.semibold, fontSize: 18, lineHeight: 26 },
  body: { ...fonts.regular, fontSize: 14, lineHeight: 20 }, 
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: theme.colors.card,
  },
});
