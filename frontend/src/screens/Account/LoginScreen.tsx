import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { common } from '../../styles/common';
import { theme } from '../../styles/theme';
import { authStyles } from '../../styles/authStyles';

export default function LoginScreen() {
  const nav = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = useMemo(() => {
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const okPw = password.trim().length >= 4; // 임시 기준(확실하지 않음)
    return okEmail && okPw;
  }, [email, password]);

  const onLogin = async () => {
    // TODO: 백엔드 연동(확실하지 않음)
    // 성공 시 인증 스택 → 앱 스택으로 전환(임시로 탭으로 이동)

    nav.reset({ index: 0, routes: [{ name: 'Tabs' as never }] });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={common.screen}>
      <ScrollView contentContainerStyle={[common.container, { paddingVertical: theme.spacing(3) }]}>
        <View style={authStyles.headerBox}>
          <Text style={common.h1}>로그인</Text>
          <Text style={authStyles.subText}>Welcome back!</Text>
        </View>

        <View style={authStyles.card}>
          <TextInput
            placeholder="이메일"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={theme.colors.muted}
            style={authStyles.input}
          />

          <View style={authStyles.gapSm} />

          <TextInput
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={theme.colors.muted}
            style={authStyles.input}
          />

          <View style={authStyles.gapMd} />

          <TouchableOpacity
            onPress={onLogin}
            disabled={!canSubmit}
            activeOpacity={0.85}
            style={[authStyles.cta, { opacity: canSubmit ? 1 : 0.5 }]}
          >
            <Text style={authStyles.ctaText}>로그인</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => nav.navigate('SignUp' as never)} style={authStyles.linkBox}>
            <Text style={authStyles.linkText}>
              계정이 없으신가요? <Text style={authStyles.linkTextStrong}>회원가입</Text>
            </Text>
          </TouchableOpacity>

          {/* 선택: 비밀번호 초기화 */}
          {/* <TouchableOpacity onPress={() => nav.navigate('ForgotPassword' as never)} style={authStyles.linkBox}> */}
          {/*   <Text style={authStyles.linkText}>비밀번호를 잊으셨나요?</Text> */}
          {/* </TouchableOpacity> */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
