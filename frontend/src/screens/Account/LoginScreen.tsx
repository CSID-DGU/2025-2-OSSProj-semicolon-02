import React, { useMemo, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { common } from '../../styles/common';
import { theme } from '../../styles/theme';
import { authStyles } from '../../styles/authStyles';
import { http } from '../../lib/http';
import { Alert } from 'react-native';

export default function LoginScreen() {
  const nav = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const okPw = password.trim().length >= 4; // 임시 기준(확실하지 않음)
    return okEmail && okPw && !loading;
  }, [email, password, loading]);

  const onLogin = async () => {
    try {
      setLoading(true);
      // 서버 연동: /api/auth/login
      const { data } = await http.post('/api/auth/login', { email, password });
      // 토큰 저장 로직은 보류
      // await SecureStore.setItemAsync('accessToken', data.accessToken);
      // await SecureStore.setItemAsync('refreshToken', data.refreshToken);

      // 성공 시 앱 스택으로 전환
      nav.reset({ index: 0, routes: [{ name: 'Tabs' as never }] });
    } catch (e) {
      console.log('[Login] error', e);
    } finally {
      setLoading(false);
    }
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
            <Text style={authStyles.ctaText}>{loading ? '처리 중...' : '로그인'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => nav.navigate('SignUp' as never)} style={authStyles.linkBox}>
            <Text style={authStyles.linkText}>
              계정이 없으신가요? <Text style={authStyles.linkTextStrong}>회원가입</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
