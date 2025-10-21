import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import RecordScreen from '../screens/record/RecordScreen';
import ReportScreen from '../screens/ReportScreen';
import MapScreen from '../screens/MapScreen';
import MyPageScreen from '../screens/MyPageScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Record: undefined;
  Report: undefined;
  Map: undefined;
  MyPage: undefined;
};

export type RootProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: '로그인' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: '회원가입' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
        <Stack.Screen name="Record" component={RecordScreen} options={{ title: '기록(Record)' }} />
        <Stack.Screen name="Report" component={ReportScreen} options={{ title: 'AI 리포트' }} />
        <Stack.Screen name="Map" component={MapScreen} options={{ title: '지도' }} />
        <Stack.Screen name="MyPage" component={MyPageScreen} options={{ title: '마이페이지' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
