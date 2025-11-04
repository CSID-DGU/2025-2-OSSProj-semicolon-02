import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';


import HomeScreen from '../screens/HomeScreen';
import MyPageScreen from '../screens/MyPage/MyPageScreen';
import AddTabButton from '../components/AddTabButton';
import TabBarBackground from '../components/TabBarBackground';
import type { TabParamList } from './types';
import { theme } from '../styles/theme';
import { tabbarStyles } from '../styles/tabbarStyles';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

const Tab = createBottomTabNavigator<TabParamList>();
function Empty() { return <View />; }

export default function BottomTabs() {
  const navigation = useNavigation<RootNav>();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray500,
        tabBarStyle: tabbarStyles.tabBar,
        tabBarItemStyle: tabbarStyles.item,
        tabBarLabelStyle: tabbarStyles.label,
        tabBarShowLabel: false,               // 라벨 숨김 (아이콘만)
        tabBarBackground: () => <TabBarBackground />,
        tabBarIcon: ({ focused, color, size: _size }) => {
          if (route.name === 'Add') return null;
          const map: Record<string, string> = {
            Home: focused ? 'home' : 'home-outline',
            MyPage: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={map[route.name]} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />

      {/* 가운데 슬롯(실제 화면 없음) */}
      <Tab.Screen
        name="Add"
        component={Empty}
        options={{
          title: '',
          tabBarButton: () => (
            <>
              {/* 공간만 차지하는 빈 슬롯 */}
              <View style={tabbarStyles.addSlot} />
              {/* 떠 있는 FAB (절대위치) */}
              <AddTabButton onPress={() => navigation.navigate('ManualAdd')} />
            </>
          ),
        }}
        listeners={{ tabPress: (e) => e.preventDefault() }}
      />

      <Tab.Screen name="MyPage" component={MyPageScreen} options={{ title: '마이페이지' }} />
    </Tab.Navigator>
  );
}
