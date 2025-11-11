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
import axios, { AxiosError } from 'axios';
import { Alert } from 'react-native';

export default function SignUpScreen() {
  const nav = useNavigation();
  const [name, setName] = useState('');          
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    const okName  = name.trim().length > 0;
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const okPw    = password.length >= 6 && password === confirm;
    return okName && okEmail && okPw && !loading;
  }, [name, email, password, confirm, loading]);

  const onSubmit = async () => {
  try {
    setLoading(true);
    await http.post('/api/auth/signup', { name, email, password });
    nav.navigate('Login' as never);
  } catch (err: unknown) {
    // Axios 오류만 좁혀서 메시지 추출
    if (axios.isAxiosError<{ message?: string }>(err)) {
      const msg = err.response?.data?.message ?? '회원가입에 실패했습니다.';
      console.log('[SignUp] axios error', err.toJSON?.() ?? err);
      Alert.alert('오류', msg);
    } else {
      console.log('[SignUp] unknown error', err);
      Alert.alert('오류', '알 수 없는 오류가 발생했습니다.');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={common.screen}
    >
      <ScrollView contentContainerStyle={[common.container, { paddingVertical: theme.spacing(3) }]}>
        <View style={authStyles.headerBox}>
          <Text style={common.h1}>회원가입</Text>
          <Text style={authStyles.subText}>Create an account to continue!</Text>
        </View>

        <View style={authStyles.card}>
          {/* 이름(단일) */}
          <TextInput
            placeholder="이름"
            value={name}
            onChangeText={setName}
            placeholderTextColor={theme.colors.muted}
            style={authStyles.input}
          />

          <View style={authStyles.gapSm} />

          {/* 이메일 */}
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

          {/* 비밀번호 */}
          <TextInput
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={theme.colors.muted}
            style={authStyles.input}
          />

          <View style={authStyles.gapSm} />

          {/* 비밀번호 확인 */}
          <TextInput
            placeholder="비밀번호 확인"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            placeholderTextColor={theme.colors.muted}
            style={authStyles.input}
          />

          <View style={authStyles.gapMd} />

          <TouchableOpacity
            onPress={onSubmit}
            disabled={!canSubmit}
            activeOpacity={0.85}
            style={[authStyles.cta, { opacity: canSubmit ? 1 : 0.5 }]}
          >
            <Text style={authStyles.ctaText}>{loading ? '처리 중...' : '회원가입'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => nav.navigate('Login' as never)} style={authStyles.linkBox}>
            <Text style={authStyles.linkText}>
              이미 계정이 있으신가요? <Text style={authStyles.linkTextStrong}>로그인</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
