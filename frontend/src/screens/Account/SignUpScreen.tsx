import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {common} from '../../styles/common';
import {theme} from '../../styles/theme';
import {useNavigation} from '@react-navigation/native';

export default function SignUpScreen() {
  const nav = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');

  const canSubmit = useMemo(() => {
    const okName  = firstName.trim().length > 0 && lastName.trim().length > 0;
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    return okName && okEmail;
  }, [firstName, lastName, email]);

  const onSubmit = () => {
    // TODO: 서버 연동 자리
    console.log({firstName, lastName, email});
    // nav.navigate('Login' as never);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ios: 'padding', android: undefined})}
      style={common.screen}
    >
      <ScrollView contentContainerStyle={[common.container, {paddingVertical: theme.spacing(3)}]}>
        {/* 상단 헤더 */}
        <View style={{paddingTop: theme.spacing(1), paddingBottom: theme.spacing(2)}}>
          <Text style={common.h1}>회원가입</Text>
          <Text style={{color: theme.colors.muted, marginTop: 6}}>Create an account to continue!</Text>
        </View>

        {/* 카드 */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: theme.radius.lg,
            padding: theme.spacing(2),
            borderWidth: 1,
            borderColor: theme.colors.line,
          }}
        >
          {/* 입력 */}
          <TextInput
            placeholder="이름"
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor={theme.colors.muted}
            style={{
              height: 48,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: theme.colors.line,
              paddingHorizontal: 14,
              backgroundColor: '#fff',
            }}
          />

          <View style={{height: theme.spacing(1.5)}} />

          <TextInput
            placeholder="성"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor={theme.colors.muted}
            style={{
              height: 48,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: theme.colors.line,
              paddingHorizontal: 14,
              backgroundColor: '#fff',
            }}
          />

          <View style={{height: theme.spacing(1.5)}} />

          <TextInput
            placeholder="이메일"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={theme.colors.muted}
            style={{
              height: 48,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: theme.colors.line,
              paddingHorizontal: 14,
              backgroundColor: '#fff',
            }}
          />

          <View style={{height: theme.spacing(2)}} />

          {/* CTA 버튼 */}
          <TouchableOpacity
            onPress={onSubmit}
            disabled={!canSubmit}
            style={{
              height: 52,
              borderRadius: theme.radius.md,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.primary,
              opacity: canSubmit ? 1 : 0.5,
              borderWidth: 1.5,
              borderColor: theme.colors.primaryDark ?? theme.colors.primary,
            }}
            activeOpacity={0.85}
          >
            <Text style={{color: '#fff', fontWeight: '700'}}>회원가입</Text>
          </TouchableOpacity>

          {/* 하단 링크 */}
          <TouchableOpacity
            onPress={() => nav.navigate('Login' as never)}
            style={{marginTop: theme.spacing(2), alignItems: 'center'}}
          >
            <Text style={{color: theme.colors.muted}}>
              이미 계정이 있으신가요? <Text style={{fontWeight: '700', color: theme.colors.text}}>로그인</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}