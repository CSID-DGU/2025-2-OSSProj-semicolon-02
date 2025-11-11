export type RootStackParamList = {
  Tabs: undefined;
  ManualAdd: undefined;
  CameraAdd: undefined;
  Favorites: undefined;          
  Statistics: undefined;
  SignUp: undefined;
  Login: undefined;
  MyReports: undefined;
  NotificationSettings: undefined;
};

// 하단 탭
export type TabParamList = {
  Home: undefined;
  Statistics: undefined;
  Add: undefined;
  CafeFind: undefined;
  MyPage: undefined;
};

// 마이페이지 전용 스택 (필요 시)
export type MyPageStackParamList = {
  MyPageMain: undefined;
  AccountSettings: undefined;
  NotificationSettings: undefined;
  FavoritesManage: undefined;    
};


//이 코드는 어디에서 왔는지 파악을 못함! 보류!

  export type NotificationSettingsStackParamList = {
    NotificationSettingsMain: undefined;
    NotificationSettingsDetail: undefined;
  };  
  export type StatisticsStackParamList = {      
    StatisticsMain: undefined;
    StatisticsDetail: undefined;
  };                  

  