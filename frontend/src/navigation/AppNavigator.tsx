import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import ManualAdd from '../screens/Add/ManualAdd';
import CafeFindScreen from '../screens/CafeFindScreen';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Tabs" component={BottomTabs} />
      <Stack.Screen name="ManualAdd" component={ManualAdd} />
      <Stack.Screen name="CafeFind" component={CafeFindScreen} />
    </Stack.Navigator>
  );
}
