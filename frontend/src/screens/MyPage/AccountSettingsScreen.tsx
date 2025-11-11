import React, {useState} from 'react';
import {SafeAreaView, View, Text, TextInput, Image, TouchableOpacity} from 'react-native';
import {theme} from '../../styles/theme';
import {common} from '../../styles/common';
import AppHeader from '../../components/AppHeader';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function AccountSettingsScreen() {
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState('홍길동');
  const [email, setEmail] = useState('user@example.com');

  const onPickImage = () => {
    // TODO: react-native-image-picker 연동 예정
  };

  const onSave = () => {
    // TODO: API 연동
    navigation.goBack();
  };

  const onLogout = () => {
  // TODO: 토큰 삭제 등 실제 로그아웃 처리 필요 (현재는 화면 이동만)
  navigation.reset({
    index: 0,
    routes: [{ name: 'Login' }], // 로그인 페이지로 스택 초기화
  });
};

  return (
    <SafeAreaView style={common.screen}>
      <AppHeader title="계정 설정" onBack={() => navigation.goBack()} />

      <View style={[common.container, {paddingTop: theme.spacing(2)}]}>
        {/* 프로필 이미지 */}
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={onPickImage} activeOpacity={0.8}>
            <Image
              source={{uri: 'https://placehold.co/120x120/png'}}
              style={{width: 120, height: 120, borderRadius: 60, borderWidth: 1, borderColor: theme.colors.line}}
            />
          </TouchableOpacity>
          <Text style={{marginTop: 8, color: theme.colors.gray500}}>이미지 변경</Text>
        </View>

        {/* 입력 카드 */}
        <View
          style={{
            marginTop: theme.spacing(3),
            backgroundColor: theme.colors.white,
            borderRadius: theme.radius.md,
            borderWidth: 1, borderColor: theme.colors.line,
            padding: theme.spacing(2),
          }}>
          <Text style={{fontWeight: '700', marginBottom: 8}}>프로필 정보</Text>

          <Text style={{fontSize: 12, color: theme.colors.gray500}}>이름</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="이름"
            style={{
              borderWidth: 1, borderColor: theme.colors.line, borderRadius: 10,
              paddingHorizontal: 12, paddingVertical: 10, marginTop: 6, marginBottom: 12,
            }}
          />

          <Text style={{fontSize: 12, color: theme.colors.gray500}}>이메일</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="이메일"
            style={{
              borderWidth: 1, borderColor: theme.colors.line, borderRadius: 10,
              paddingHorizontal: 12, paddingVertical: 10, marginTop: 6,
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
            height: 48, borderRadius: 12,
            alignItems: 'center', justifyContent: 'center',
          }}>
          <Text style={{color: 'white', fontWeight: '700'}}>저장</Text>
        </TouchableOpacity>
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