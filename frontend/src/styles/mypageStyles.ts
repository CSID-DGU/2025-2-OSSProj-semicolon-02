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
  profileLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.card },
  profileInfo: { marginLeft: 12 },
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

  // 목표 카드 (월간/일간 토글 표시)
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

  segment: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: 4,
  },
  segBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  segBtnActive: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  segTxt: { fontSize: 12, color: theme.colors.text, fontWeight: '700' },

  goalValueBox: {
    marginTop: theme.spacing(2),
    paddingVertical: theme.spacing(2),
    paddingHorizontal: theme.spacing(2),
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surface,
  },
  goalValueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalLabel: { fontSize: 14, color: theme.colors.gray700, fontWeight: '600' },
  goalValue: { fontSize: 20, fontWeight: '800', color: theme.colors.primary },

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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text },

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
