import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyPageScreen from '../screens/MyPage/MyPageScreen';
import AccountSettingsScreen from '../screens/MyPage/AccountSettingsScreen';
// import NotificationSettings from '../screens/MyPage/NotificationSettings';
// import FavoritesManage from '../screens/MyPage/FavoritesManage';

import type { MyPageStackParamList } from './types';

const Stack = createNativeStackNavigator<MyPageStackParamList>();

export default function MyPageStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyPageMain" component={MyPageScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      {/* <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
      <Stack.Screen name="FavoritesManage" component={FavoritesManage} /> */}
    </Stack.Navigator>
  );
}
