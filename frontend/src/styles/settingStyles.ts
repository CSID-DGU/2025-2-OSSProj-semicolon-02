import {StyleSheet} from 'react-native';
import {theme} from './theme';

export const settingStyles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  title: {fontSize: 16, fontWeight: '700', marginBottom: 4},
});
