import {  StyleSheet  } from 'react-native';
import {  theme  } from './theme';
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
    marginTop: theme.spacing(2),
    backgroundColor: theme.colors.primary,
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
  /** 수면 요약 카드 */
  sleepCard: {
    ...common.card,
    ...common.shadowCard,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing(3),
    marginTop: theme.spacing(4),
    paddingVertical: theme.spacing(2),
    paddingHorizontal: theme.spacing(2),
  },
  sleepLeft: {
    flex: 1,
  },
  sleepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sleepIcon: {
    marginRight: 8,
  },
  sleepValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginRight: 6,
  },
  sleepLabelSmall: {
    ...common.subtle,
  },
  sleepLabel: {
    ...common.subtle,
    color: theme.colors.gray600,
  },
  sleepRight: {
    marginLeft: theme.spacing(2),
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    //height: '100%',
  },
  sleepHistoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  sleepHistoryText: {
    fontSize: 12,
    color: theme.colors.gray600,
    marginRight: 2,
  },
  sleepEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing(1),
    paddingVertical: theme.spacing(0.5),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  sleepEditText: {
    fontSize: 12,
    color: theme.colors.gray600,
    marginLeft: 4,
  },

  /** 홈 수면 편집 오버레이 */
  sleepEditOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sleepEditCard: {
    width: '80%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: theme.spacing(3),
    ...theme.shadow.card,
  },
  sleepEditTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: theme.spacing(2),
    color: theme.colors.text,
  },
  sleepEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1.5),
  },
  sleepInput: {
    minWidth: 90,
    paddingHorizontal: theme.spacing(1),
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    textAlign: 'center',
  },
  sleepEditActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
  sleepCancelBtn: {
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  sleepCancelText: {
    fontSize: 13,
    color: theme.colors.gray600,
  },
  sleepSaveBtn: {
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1),
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary,
  },
  sleepSaveText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.white,
  },

  
    /** 수면 히스토리 카드 */
    sleepHistoryCard: {
      ...common.card,
      ...common.shadowCard,
      backgroundColor: theme.colors.white,
      marginHorizontal: theme.spacing(3),
      marginTop: theme.spacing(1.5),
    },
    sleepHistoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(1),
    },
    sleepHistoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sleepHistoryLeft: {
      flex: 1,
      marginRight: theme.spacing(2),
    },
    sleepBarTrack: {
      height: 8,
      borderRadius: 999,
      backgroundColor: theme.colors.gray100,
      overflow: 'hidden',
    },
    sleepBarFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: theme.colors.primary,
    },
    sleepHistoryDuration: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.text,
    },
    sleepHistoryRight: {
      flex: 1,
    },
    sleepHistoryMeta: {
      fontSize: 12,
      color: theme.colors.gray600,
      marginBottom: 2,
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
  gaugeValue: { fontSize: 28, fontWeight: '800', color: theme.colors.text },
  subtle: { fontSize: 12, color: theme.colors.gray500 },
  //section: { marginTop: theme.spacing(2) },
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

  /** 섭취 권고 */
  adviceCard: {
    ...common.card,
    ...common.shadowCard,
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing(3),
  },

});
