export const theme = {
  colors: {
    primary: '#9b8e7d',
    background: '#F7F7F7',
    surface: '#faf9f8ff',
    card: '#eaded1',
    text: '#191919',
    line: '#EFE7DB',
    gray700: '#555555',
    gray600: '#666666',
    gray500: '#8C8C8C',
    gray300: '#D9D9D9',
    gray100: '#F7F7F7',
    white: '#FFFFFF',
    muted: '#8e8e8e',
    primaryDark: '#9b856d',
    // 통계 헤더 배경은 하드코딩 대신 토큰으로
    header: '#f3e9d8',        // 불투명 배경
    headerTint: '#191919',
  },
  spacing: (n: number) => n * 8,
  radius: { sm: 10, md: 16, lg: 20, xl: 28 },
  shadow: {
    card: {
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },
  },
  // ▼ 새 레이아웃 토큰
  layout: {
    screenPX: 3,      // paddingHorizontal: spacing(3) = 24
    sectionGap: 3,    // 섹션 상단 여백
    cardPadding: 2,   // 카드 내부 패딩
    gridGap: 2,       // 그리드 간격
    headerPT: 5,      // 헤더 상단 패딩
    headerPB: 4,      // 헤더 하단 패딩
    pillPX: 2,
    pillPY: 1,
    iconBtn: 36,      // 정사각 아이콘 버튼 한 변
    fab: 56,          // FAB 지름
  },
};
