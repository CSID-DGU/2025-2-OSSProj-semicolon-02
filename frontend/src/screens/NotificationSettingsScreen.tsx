import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Platform, Dimensions, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { notificationSettingsStyles } from '../styles/notificationSettingsStyles';
import { theme } from '../styles/theme';

type NotificationNav = NativeStackNavigationProp<RootStackParamList>;

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function NotificationSettingsScreen() {
  const navigation = useNavigation<NotificationNav>();
  const screenWidth = Dimensions.get('window').width;
  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;
  const headerHeight = statusBarHeight + 70; // 상태바 높이 + 헤더 콘텐츠 높이

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {// 임의로 정보 기입
      id: '1',
      title: '헬스 정보',
      description: '헬스 정보 알림 받기',
      enabled: true,
    },
    {
      id: '2',
      title: '섭취량 알림',
      description: '현재 카페인 섭취량 알림 받기',
      enabled: true,
    },
    {
      id: '3',
      title: '추천 음료 알림',
      description: '오늘 마실 음료 추천 알림 받기',
      enabled: true,
    },
  ]);

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  return (
    <View style={notificationSettingsStyles.screen}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      {/* 상단 헤더 (그라데이션) */}
      <View style={notificationSettingsStyles.headerContainer}>
        <Svg
          style={notificationSettingsStyles.headerGradientSvg}
          width={screenWidth}
          height={headerHeight}
        >
          <Defs>
            <LinearGradient id="headerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#F5E6D3" stopOpacity="1" />
              <Stop offset="100%" stopColor="#E8D5C4" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect
            width={screenWidth}
            height={headerHeight}
            fill="url(#headerGradient)"
          />
        </Svg>
        <View style={[notificationSettingsStyles.header, { paddingTop: statusBarHeight }]}>
          <View style={notificationSettingsStyles.headerContent}>
            <TouchableOpacity
              style={notificationSettingsStyles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={notificationSettingsStyles.headerTitle}>알림설정</Text>
          </View>
        </View>
      </View>

      {/* 콘텐츠 영역 */}
      <ScrollView
        style={notificationSettingsStyles.content}
        contentContainerStyle={notificationSettingsStyles.contentContainer}
      >
        {notifications.map((item, index) => (
          <View key={item.id}>
            <View style={notificationSettingsStyles.notificationItem}>
              <View style={notificationSettingsStyles.notificationText}>
                <Text style={notificationSettingsStyles.notificationTitle}>
                  {item.title}
                </Text>
                <Text style={notificationSettingsStyles.notificationDescription}>
                  {item.description}
                </Text>
              </View>
              <Switch
                value={item.enabled}
                onValueChange={() => toggleNotification(item.id)}
                trackColor={{
                  false: theme.colors.gray300, // 꺼짐 상태 색상
                  true: theme.colors.primary, // 켜짐 상태 색상 (갈색 계열)
                }}
                thumbColor="#FFFFFF" // 토글 핸들 색상
                ios_backgroundColor={theme.colors.gray300}
              />
            </View>
            {index < notifications.length - 1 && (
              <View style={notificationSettingsStyles.divider} />
            )}
          </View>
        ))}
      </ScrollView>

      {/* 하단 바 (임시로 추가함) */}
      <View style={notificationSettingsStyles.bottomBar}>
        <View style={notificationSettingsStyles.bottomBarItem}>
          <Ionicons name="home-outline" size={24} color={theme.colors.gray500} />
        </View>
        <View style={notificationSettingsStyles.bottomBarItem}>
          <Ionicons
            name="time-outline"
            size={24}
            color={theme.colors.gray500}
          />
        </View>
        <View style={notificationSettingsStyles.bottomBarItem}>
          <Ionicons
            name="wallet-outline"
            size={24}
            color={theme.colors.gray500}
          />
        </View>
        <View style={notificationSettingsStyles.bottomBarItem}>
          <Ionicons
            name="person-outline"
            size={24}
            color={theme.colors.gray500}
          />
        </View>
      </View>
    </View>
  );
}

