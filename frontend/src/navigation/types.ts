// RootStack: 앱 전역 화면
export type RootStackParamList = {
  Tabs: undefined;
  ManualAdd: undefined;
  CameraAdd: undefined;
  Favorites: undefined;
  Statistics: undefined;
  SignUp: undefined;
  MyReports: undefined;
};

// 하단 탭
export type TabParamList = {
  Home: undefined;
  Add: undefined;
  MyPage: undefined; 
};

// 마이페이지 전용 스택
export type MyPageStackParamList = {
  MyPageMain: undefined;
  AccountSettings: undefined;
  NotificationSettings: undefined;
  FavoritesManage: undefined;
};
