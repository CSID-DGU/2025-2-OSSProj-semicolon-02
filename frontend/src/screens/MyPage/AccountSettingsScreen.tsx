import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { theme } from '../../styles/theme';
import { common } from '../../styles/common';
import AppHeader from '../../components/AppHeader';
import type { RootStackParamList } from '../../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { clearCurrentUser } from '../../lib/authSession';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type StoredUser = {
  id: number;
  name: string;
  email: string;
};

export default function AccountSettingsScreen() {
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // 최초 진입 시 로그인 정보 불러오기
  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem('caffit:user');
        if (!raw) {
          return;
        }
        const parsed: StoredUser = JSON.parse(raw);
        setName(parsed.name ?? '');
        setEmail(parsed.email ?? '');
      } catch (e) {
        console.log('[AccountSettings] load user error', e);
      }
    };

    loadUser();
  }, []);

  const onSave = async () => {
    try {
      const raw = await AsyncStorage.getItem('caffit:user');
      if (!raw) {
        Alert.alert('안내', '로그인 정보가 없습니다. 다시 로그인해 주세요.');
        return;
      }

      const parsed: StoredUser = JSON.parse(raw);
      const updated: StoredUser = {
        ...parsed,
        name,
        email,
      };

      // TODO: 이후 백엔드에 프로필 수정 API가 생기면 여기서 http.patch 등으로 호출
      await AsyncStorage.setItem('caffit:user', JSON.stringify(updated));

      Alert.alert('완료', '프로필 정보를 저장했습니다.', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      console.log('[AccountSettings] save error', e);
      Alert.alert('오류', '프로필 저장 중 문제가 발생했습니다.');
    }
  };

  const onLogout = async () => {
    await clearCurrentUser();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={common.screen}>
      <AppHeader title="계정 설정" onBack={() => navigation.goBack()} />

      <View style={[common.container, { paddingTop: theme.spacing(2) }]}>
        {/* 입력 카드 */}
        <View
          style={{
            marginTop: theme.spacing(1),
            backgroundColor: theme.colors.white,
            borderRadius: theme.radius.md,
            borderWidth: 1,
            borderColor: theme.colors.line,
            padding: theme.spacing(2),
          }}
        >
          <Text style={{ fontWeight: '700', marginBottom: 8 }}>프로필 정보</Text>

          <Text style={{ fontSize: 12, color: theme.colors.gray500 }}>이름</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="이름"
            style={{
              borderWidth: 1,
              borderColor: theme.colors.line,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginTop: 6,
              marginBottom: 12,
            }}
          />

          <Text style={{ fontSize: 12, color: theme.colors.gray500 }}>이메일</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="이메일"
            style={{
              borderWidth: 1,
              borderColor: theme.colors.line,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginTop: 6,
            }}
          />
        </View>

        {/* 저장 버튼 */}
        <TouchableOpacity
          onPress={onSave}
          activeOpacity={0.9}
          style={{
            marginTop: theme.spacing(3),
            backgroundColor: theme.colors.primary,
            height: 48,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700' }}>저장</Text>
        </TouchableOpacity>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity
          onPress={onLogout}
          activeOpacity={0.9}
          style={{
            marginTop: theme.spacing(2),
            backgroundColor: theme.colors.gray100,
            height: 48,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: theme.colors.line,
          }}
        >
          <Text style={{ color: theme.colors.text, fontWeight: '700' }}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
