import { StyleSheet } from 'react-native';
import { theme } from './theme';
import { common, fonts } from './common';

export const mypageStyles = StyleSheet.create({
  /** 상단 히어로 */
  hero: {
    ...common.card,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTitle: {
    ...fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    color: theme.colors.text,
    fontWeight: '800',
  },

  /** 프로필 카드 */
  profileCard: {
    ...common.card,
    marginTop: theme.spacing(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
  },
  profileLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.card },
  profileInfo: { marginLeft: 12 },
  name: { ...fonts.bold, fontSize: 16, color: theme.colors.text },
  subId: { ...fonts.regular, fontSize: 12, color: theme.colors.gray500, marginTop: 2 },
  editPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  editPillTxt: { ...fonts.bold, color: theme.colors.text },

  /** 목표 카드 (일간/월간 토글 포함) */
  goalCard: {
    ...common.card,
    marginTop: theme.spacing(2),
    backgroundColor: theme.colors.white,
  },
  goalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  goalTitle: { ...fonts.bold, fontSize: 16, color: theme.colors.text },
  goalSub: { ...fonts.regular, fontSize: 12, color: theme.colors.gray500, marginTop: 2 },

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
  segTxt: { ...fonts.bold, fontSize: 12, color: theme.colors.text },

  goalValueBox: {
    marginTop: theme.spacing(2),
    paddingVertical: theme.spacing(2),
    paddingHorizontal: theme.spacing(2),
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surface,
  },
  goalValueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  goalLabel: { ...fonts.semibold, fontSize: 14, color: theme.colors.gray700 },
  goalValue: { ...fonts.black, fontSize: 20, color: theme.colors.primary, fontWeight: '800' },

  /** 리스트 섹션 */
  sectionCard: {
    ...common.card,
    marginTop: theme.spacing(2),
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: { ...fonts.bold, fontSize: 16, color: theme.colors.text },

  row: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.line,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowLabel: { ...fonts.regular, fontSize: 14, color: theme.colors.text },
  rowArrow: { color: theme.colors.gray500, fontSize: 16 },
});
