import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';
import MapScreen from '../screens/MapScreen';
import MyScreen from '../screens/MyScreen';

import IntakeHomeScreen from '../screens/intake/IntakeHomeScreen';
import ManualIntakeScreen from '../screens/intake/ManualIntakeScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function IntakeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="IntakeHome"
        component={IntakeHomeScreen}
        options={{ title: '기록' }}
      />
      <Stack.Screen
        name="ManualIntake"
        component={ManualIntakeScreen}
        options={{ title: '수동 입력' }}
      />
      {/* 추후: OCRIntake, FavoriteIntake 등 추가 */}
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="기록" component={IntakeStack} />
      <Tab.Screen name="리포트" component={ReportScreen} />
      <Tab.Screen name="지도" component={MapScreen} />
      <Tab.Screen name="마이페이지" component={MyScreen} />
    </Tab.Navigator>
  );
}
