import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const homeStyles = StyleSheet.create({
  headerWrap: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
  gaugeCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    ...theme.shadow.card,
  },
  gaugeValue: { fontSize: 28, fontWeight: '800', color: theme.colors.text },
  subtle: { fontSize: 12, color: theme.colors.gray500 },
  section: { marginTop: theme.spacing(2) },
  grid: { flexDirection: 'row', gap: theme.spacing(2) },
  fab: {
    position: 'absolute',
    right: theme.spacing(2),
    bottom: theme.spacing(10),
    backgroundColor: theme.colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: { color: 'white', fontWeight: '700' },
});
