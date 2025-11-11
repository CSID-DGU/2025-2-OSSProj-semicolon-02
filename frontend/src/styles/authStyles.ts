import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const authStyles = StyleSheet.create({
  headerBox: { paddingTop: theme.spacing(1), paddingBottom: theme.spacing(2) },
  subText: { color: theme.colors.muted, marginTop: 6 },

  card: {
    backgroundColor: '#fff',
    borderRadius: theme.radius.lg,
    padding: theme.spacing(2),
    borderWidth: 1,
    borderColor: theme.colors.line,
  },

  input: {
    height: 48,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },

  gapSm: { height: theme.spacing(1.5) },
  gapMd: { height: theme.spacing(2) },

  cta: {
    height: 52,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  ctaText: { color: '#fff', fontWeight: '700' },

  linkBox: { marginTop: theme.spacing(2), alignItems: 'center' },
  linkText: { color: theme.colors.muted },
  linkTextStrong: { fontWeight: '700', color: theme.colors.text },
});
