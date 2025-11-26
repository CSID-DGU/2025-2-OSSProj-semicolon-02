import { StyleSheet, Platform } from 'react-native';
import { theme } from './theme';

export const notificationSettingsStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5E6D3', // 헤더 그라데이션 시작 색상으로 설정하여 상단 공백 제거
  },
  headerContainer: {
    position: 'relative',
    zIndex: 1,
  },
  headerGradientSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    paddingTop: 0, // StatusBar 높이를 동적으로 설정하므로 여기서는 0
    paddingBottom: theme.spacing(2),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(1.5),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingTop: theme.spacing(2),
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(2),
    backgroundColor: theme.colors.background, // 항목 배경색: 여기를 변경하세요 (예: '#F5F5F5' 또는 theme.colors.surface)
  },
  notificationText: {
    flex: 1,
    marginRight: theme.spacing(2),
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing(0.25),
  },
  notificationDescription: {
    fontSize: 14,
    color: theme.colors.gray500,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.gray300,
    marginLeft: theme.spacing(2),
  },
  // 하단 바 (임시)
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.line,
    paddingBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  bottomBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});


