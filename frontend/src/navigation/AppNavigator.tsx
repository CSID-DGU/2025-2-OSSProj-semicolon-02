import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import ManualAdd from '../screens/Add/ManualAdd';
import CameraAdd from '../screens/Add/CameraAdd';
// import Favorites from '../screens/Favorites/Favorites';
// import Statistics from '../screens/Statistics/Statistics';
// import SignUp from '../screens/Auth/SignUp';
// import MyReports from '../screens/MyPage/MyReports';

import type { RootStackParamList } from './types';

import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
      {/* 하단 탭 네비게이터 */}
      <Stack.Screen name="Tabs" component={BottomTabs} />

      {/* 전역 공용 스크린들 */}
      <Stack.Screen name="ManualAdd" component={ManualAdd} />
      <Stack.Screen name="CameraAdd" component={CameraAdd} />
      {/* <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="Statistics" component={Statistics} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="MyReports" component={MyReports} /> */}
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
    </Stack.Navigator>
  );
}
