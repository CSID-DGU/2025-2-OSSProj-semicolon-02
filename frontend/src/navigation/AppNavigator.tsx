// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

import BottomTabs from './BottomTabs';
import AccountSettingsScreen from '../screens/MyPage/AccountSettingsScreen';

// 미구현 화면은 임시 컴포넌트로 대체
const ManualAddScreen = () => null;
const NotificationSettingsScreen = () => null;
const FavoritesManageScreen = () => null;
const MyReportsScreen = () => null;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={BottomTabs} />

      <Stack.Screen name="ManualAdd" component={ManualAddScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="FavoritesManage" component={FavoritesManageScreen} />
      <Stack.Screen name="MyReports" component={MyReportsScreen} />
    </Stack.Navigator>
  );
}
