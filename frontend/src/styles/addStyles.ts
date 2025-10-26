import {StyleSheet} from 'react-native';
import {theme} from './theme';

export const addStyles = StyleSheet.create({
  scrollInner: {
    paddingTop: 18,
  },

  fieldWrap: {
    marginTop: 12,
  },
  fieldLabel: {
    fontSize: 12,
    color: theme.colors.gray500,
  },
  input: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: theme.colors.background,
  },

  gap20: {height: 20},
  gap24: {height: 24},

  saveBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 8, // RN 0.72+ 지원. 하위 버전이면 대신 marginRight로 처리
    ...theme.shadow.card,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
  },
});
