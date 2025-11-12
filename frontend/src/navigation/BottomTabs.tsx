import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import StatisticsScreen from '../screens/Statistics/StatisticsScreen';
import CafeFindScreen from '../screens/CafeFindScreen'; 

import FabMenu from '../components/FabMenu';
import MyPageStack from '../navigation/MyPageStack';

import { theme } from '../styles/theme';
import { tabbarStyles, TAB_HEIGHT } from '../styles/tabbarStyles';

import type { TabParamList, RootStackParamList } from './types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
//import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';

type RootNav = NativeStackNavigationProp<RootStackParamList>;
const Tab = createBottomTabNavigator<TabParamList>();

function Empty() {
  return <View />;
}

export default function BottomTabs() {
  const navigation = useNavigation<RootNav>();

  return (
    <View style={{ flex: 1 }}>
      {/* 탭바 위쪽으로 나는 얕은 그림자 (iOS: shadow, Android: 미약한 음영 효과) */}
      <View style={tabbarStyles.shadowOverlay} pointerEvents="none" />

      <Tab.Navigator
        screenOptions={({ route }:{
          route: RouteProp<TabParamList, keyof TabParamList>;
        }) => ({
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.gray500,
          tabBarStyle: tabbarStyles.tabBar,
          tabBarItemStyle: tabbarStyles.item,
          tabBarLabelStyle: tabbarStyles.label,
          tabBarShowLabel: false,

          // tabBarBackground: undefined,
          tabBarIcon: ({ focused, color }:
            { focused: boolean; color: string; }
          ) => {
            if (route.name === 'Add') return null;
            const icons: Record<string, string> = {
              Home: focused ? 'home' : 'home-outline',
              Statistics: focused ? 'stats-chart' : 'stats-chart-outline',
              CafeFind: focused ? 'navigate' : 'navigate-outline',
              MyPage: focused ? 'person' : 'person-outline',
            };
            return <Ionicons name={icons[route.name]} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />

        <Tab.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{
            title: '통계',
            tabBarItemStyle:tabbarStyles.item,
          }}
        />

        <Tab.Screen
          name="Add"
          component={Empty}
          options={{
            title: '',
            tabBarButton: () => <View style={tabbarStyles.addSlot} />,
          }}
          listeners={{ tabPress: (e) => e.preventDefault() }}
         />
        <Tab.Screen
          name="CafeFind"
          component={CafeFindScreen}
          options={{ 
            title: '지도',
            tabBarItemStyle: tabbarStyles.item,
          }}
        /> 
        {/* 마이페이지 스택 */}
        <Tab.Screen name="MyPage" component={MyPageStack} options={{ title: '마이페이지' }} />
      </Tab.Navigator>

      <FabMenu />
    </View>
  );
}