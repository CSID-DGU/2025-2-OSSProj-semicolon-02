import React from 'react';
import {View, Text, Switch, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {common} from '../styles/common';
import {theme} from '../styles/theme';

type MyPageNav = NativeStackNavigationProp<RootStackParamList>;

export default function MyPageScreen() {
  const navigation = useNavigation<MyPageNav>();

  return (
    <View style={common.screen}>
      <ScrollView contentContainerStyle={[common.container]}>
        <View style={{paddingTop: 24, paddingBottom: 12}}>
          <Text style={common.h1}>마이 페이지</Text>
        </View>

        <View style={{
          backgroundColor: '#fff',
          borderRadius: theme.radius.md,
          padding: 16,
          borderWidth: 1, borderColor: theme.colors.line,
        }}>
          <Text style={{fontWeight: '700', fontSize: 16}}>목표/알림</Text>

          <View style={{marginTop: 16, flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>일일 허용치 초과 알림</Text>
            <Switch value />
          </View>

          <View style={{marginTop: 16, flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>취침 전 차단 알림</Text>
            <Switch />
          </View>

          {/* 알림 설정 탭 */}
          <TouchableOpacity
            style={{
              marginTop: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 4,
            }}
            onPress={() => navigation.navigate('NotificationSettings')}
            activeOpacity={0.7}
          >
            <Text>알림설정</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.gray500}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
