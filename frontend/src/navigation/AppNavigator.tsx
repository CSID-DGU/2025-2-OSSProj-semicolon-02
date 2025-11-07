import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import ManualAdd from '../screens/Add/ManualAdd';
import CameraAdd from '../screens/Add/CameraAdd';
import Favorites from '../screens/Add/Favorites';
import StatisticsScreen from '../screens/Statistics/StatisticsScreen';
import SignUp from '../screens/SignUpScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={BottomTabs} />
      <Stack.Screen name="ManualAdd" component={ManualAdd} />
      <Stack.Screen name="CameraAdd" component={CameraAdd} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="Statistics" component={StatisticsScreen} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
    </Stack.Navigator>
  );
}
