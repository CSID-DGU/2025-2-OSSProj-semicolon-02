import {StyleSheet} from 'react-native';
import {theme} from './theme';

export const cafeFindStyles = StyleSheet.create({
  // 지도 컨테이너 (임시)
  mapContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholder: {
    fontSize: 16,
    color: theme.colors.gray500,
  },

  // Bottom Sheet
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    ...theme.shadow.card,
    shadowOffset: {width: 0, height: -4},
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(2),
  },

  // Handle
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.gray300,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: theme.spacing(2),
  },

  // 헤더
  header: {
    paddingHorizontal: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing(0.5),
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.gray500,
    textAlign: 'center',
  },

  // 진행 상태 바
  progressBar: {
    flexDirection: 'row',
    gap: theme.spacing(0.75),
    paddingHorizontal: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  progressItem: {
    flex: 1,
    height: 4,
    backgroundColor: theme.colors.gray300,
    borderRadius: 2,
  },
  progressItemActive: {
    backgroundColor: '#4CAF50', // 초록색
  },

  // 콘텐츠 스크롤 영역
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing(2),
  },

  // 메뉴 카드
  menuCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  menuCardIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(1.5),
  },
  menuCardContent: {
    flex: 1,
  },
  menuCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing(0.5),
  },
  menuCardSubtitle: {
    fontSize: 12,
    color: theme.colors.gray500,
    lineHeight: 16,
  },

  // 카페 리스트
  cafeList: {
    gap: theme.spacing(1.5),
  },
});

