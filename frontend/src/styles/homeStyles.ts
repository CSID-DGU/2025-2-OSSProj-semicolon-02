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
  // 주변 카페 찾기 카드 관련 스타일 - 임의로 추가함
  findCafeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderWidth: 1,
    borderColor: theme.colors.line,
    ...theme.shadow.card,
  },
  findCafeIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(1.5),
  },
  findCafeContent: {
    flex: 1,
  },
  findCafeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing(0.25),
  },
  findCafeSubtitle: {
    fontSize: 12,
    color: theme.colors.gray500,
    lineHeight: 16,
  },
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
