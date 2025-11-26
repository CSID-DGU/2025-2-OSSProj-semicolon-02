// styles/favoritesStyles.ts
import {StyleSheet} from 'react-native';
import {theme} from './theme';
import {common, fonts} from './common';

export const favoritesStyles = StyleSheet.create({
  panel: {
    marginTop: theme.spacing(2),
  },

  /** 카테고리 칩 */
  chipRow: {
    flexDirection: 'row',
    columnGap: 8,
    marginBottom: theme.spacing(2),
  },
  chip: {
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1),
    borderRadius: 999,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipInactive: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray300,
  },
  chipText: {
    ...fonts.bold,
    fontSize: 13,
  },
  chipTextActive: {color: theme.colors.white},
  chipTextInactive: {color: theme.colors.gray700},

  /** 즐겨찾기 카드 한 줄 */
  rowCard: {
    ...common.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing(1.75),
    paddingHorizontal: theme.spacing(2),
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.white,
  },
  rowTextWrap: {
    flex: 1,
  },
  rowTitle: {
    ...fonts.bold,
    fontSize: 15,
    color: theme.colors.text,
  },
  rowSub: {
    ...fonts.regular,
    fontSize: 12,
    color: theme.colors.gray500,
    marginTop: 2,
  },
  caffeine: {
    ...fonts.medium,
    fontSize: 13,
    color: theme.colors.gray600,
    marginLeft: theme.spacing(1),
  },

  /** 아이템 사이 구분선 (배경색과 살짝만 차이) */
  separator: {
    height: theme.spacing(1.25),
    backgroundColor: theme.colors.background,
  },
});
