import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const mypageStyles = StyleSheet.create({
  hero: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing(2),
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroTitle: { fontSize: 22, fontWeight: '800', color: theme.colors.text },

  profileCard: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: theme.spacing(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.card },
  name: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  subId: { fontSize: 12, color: theme.colors.gray500, marginTop: 2 },
  editPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  editPillTxt: { fontWeight: '700', color: theme.colors.text },

  // goal card
  goalCard: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: theme.spacing(2),
  },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text },
  goalSub: { fontSize: 12, color: theme.colors.gray500, marginTop: 2 },
  dropdownPill: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
    backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.line,
  },
  dropdownTxt: { fontSize: 12, color: theme.colors.text },

  donutWrap: { alignItems: 'center', justifyContent: 'center', marginTop: theme.spacing(2) },
  donutOuter: {
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: theme.colors.surface,
    borderWidth: 10, borderColor: theme.colors.card,
  },
  donutInner: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: theme.colors.white, alignItems: 'center', justifyContent: 'center',
  },
  donutPercent: { fontSize: 22, fontWeight: '800', color: theme.colors.primary },

  // list section
  sectionCard: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    paddingHorizontal: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text },
  sectionSeeAll: { fontSize: 12, color: theme.colors.gray500 },

  row: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.line,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowLabel: { fontSize: 14, color: theme.colors.text },
  rowArrow: { color: theme.colors.gray500, fontSize: 16 },
});
