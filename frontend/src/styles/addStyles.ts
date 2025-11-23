// styles/addStyles.ts
import {StyleSheet} from 'react-native';
import {theme} from './theme';
import {fonts} from './common';

export const addStyles = StyleSheet.create({
  /** ScrollView 안쪽 여백 */
  scrollInner: {
    paddingTop: theme.spacing(3),
  },

  /** 필드 래퍼 */
  fieldWrap: {
    marginTop: theme.spacing(2),
  },

  /** 라벨 텍스트 */
  fieldLabel: {
    ...fonts.medium,
    fontSize: 12,
    color: theme.colors.gray600,
  },

  /** 인풋 박스 */
  input: {
    marginTop: theme.spacing(0.75),
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1.5),
    backgroundColor: theme.colors.white,
  },

  /** 간격용 뷰 */
  gap20: {height: theme.spacing(2.5)},
  gap24: {height: theme.spacing(3)},

  /** 저장 버튼 */
  saveBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing(1.75),
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 8,
    ...theme.shadow.card,
  },

  /** 저장 버튼 텍스트 (두껍게 + 그림자) */
  saveText: {
    ...fonts.bold,
    fontSize: 15,
    color: theme.colors.white,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
});
