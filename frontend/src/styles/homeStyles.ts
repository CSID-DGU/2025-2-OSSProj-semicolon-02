import { StyleSheet } from 'react-native';
import { theme } from './theme';
import { common } from './common';

export const homeStyles = StyleSheet.create({
  /** 화면 배경 */
  screenBG: {
    flex: 1,
    backgroundColor: theme.colors.gray100, 
  },

  /** 상단: 제목 + 설정 버튼 포함 위젯 */
  caffeineWidget: {
    marginHorizontal: theme.spacing(3),
    marginTop: theme.spacing(4),
    backgroundColor: theme.colors.primary, // 진한 배경
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing(3),
    paddingHorizontal: theme.spacing(3),
    ...theme.shadow.card,
  },

  widgetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  widgetTitle: {
    ...common.h1,
    color: theme.colors.white,
  },
  widgetSubTitle: {
    ...common.subtle,
    color: 'rgba(255,255,255,0.8)',
  },
  widgetIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  widgetContentRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  widgetLeft: {},
  widgetRight: { alignItems: 'flex-end' },
  widgetMg: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.white,
  },
  widgetPercent: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.white,
  },
  widgetLabel: {
    ...common.subtle,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text,
    marginHorizontal: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  
  /** 요약 */
  section: { ...common.section },
  statRow: {
    flexDirection: 'row',
    gap: theme.spacing(2),
    marginHorizontal: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  statCard: {
    ...common.card,
    ...common.shadowCard,
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  statTitle: { ...common.subtle },
  statValueBig: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: theme.spacing(1),
  },
  statNote: { ...common.subtle, marginTop: theme.spacing(0.5) },

  /** 그래프 카드 */
  chartCard: {
    ...common.card,
    ...common.shadowCard,
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing(3),
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** 섭취 권고 */
  adviceCard: {
    ...common.card,
    ...common.shadowCard,
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing(3),
  },
});
