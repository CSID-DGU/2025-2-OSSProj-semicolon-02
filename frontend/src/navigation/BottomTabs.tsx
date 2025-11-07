import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import StatisticsScreen from '../screens/Statistics/StatisticsScreen';

import AddTabButton from '../components/AddTabButton';
import FabMenu from '../components/FabMenu';
import TabBarBackground from '../components/TabBarBackground';
import MyPageStack from '../navigation/MyPageStack';

import { theme } from '../styles/theme';
import { tabbarStyles } from '../styles/tabbarStyles';

import type { TabParamList } from './types';
import type { RootStackParamList } from './types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

const Tab = createBottomTabNavigator<TabParamList>();
function Empty() {
  return <View />;
}

export default function BottomTabs() {
  const navigation = useNavigation<RootNav>();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.gray500,
          tabBarStyle: tabbarStyles.tabBar,
          tabBarItemStyle: tabbarStyles.item,
          tabBarLabelStyle: tabbarStyles.label,
          tabBarShowLabel: false,
          tabBarBackground: () => <TabBarBackground />,
          tabBarIcon: ({ focused, color }) => {
            if (route.name === 'Add') return null;
            const icons: Record<string, string> = {
              Home: focused ? 'home' : 'home-outline',
              Statistics: focused ? 'stats-chart' : 'stats-chart-outline', 
              MyPage: focused ? 'person' : 'person-outline',
            };
            return <Ionicons name={icons[route.name]} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />

        <Tab.Screen name="Statistics" component={StatisticsScreen} options={{ title: '통계' }} />

        {/* 가운데 Add 버튼 슬롯 */}
        <Tab.Screen
          name="Add"
          component={Empty}
          options={{
            title: '',
            tabBarButton: () => <View style={tabbarStyles.addSlot} />,
          }}
          listeners={{ tabPress: (e) => e.preventDefault() }}
        />

        {/* 마이페이지 스택 */}
        <Tab.Screen name="MyPage" component={MyPageStack} options={{ title: '마이페이지' }} />
      </Tab.Navigator>

      {/* 플로팅 메뉴 (수동 추가, 카메라 추가, 즐겨찾기 등) */}
      <FabMenu />
    </View>
  );
}
