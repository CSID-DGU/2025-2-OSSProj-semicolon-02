import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { common } from '../../styles/common';
import { theme } from '../../styles/theme';
import { authStyles } from '../../styles/authStyles';

export default function SignUpScreen() {
  const nav = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');

  const canSubmit = useMemo(() => {
    const okName  = firstName.trim().length > 0 && lastName.trim().length > 0;
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const okPw    = password.length >= 6 && password === confirm; // 기준: 6자 이상 & 일치
    return okName && okEmail && okPw;
  }, [firstName, lastName, email, password, confirm]);

  const onSubmit = () => {
    // TODO: 서버 연동 
    console.log({ firstName, lastName, email, password });
    // 임시: 회원가입 후 로그인 화면으로
    nav.navigate('Login' as never);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={common.screen}
    >
      <ScrollView contentContainerStyle={[common.container, { paddingVertical: theme.spacing(3) }]}>
        {/* 상단 헤더 */}
        <View style={authStyles.headerBox}>
          <Text style={common.h1}>회원가입</Text>
          <Text style={authStyles.subText}>Create an account to continue!</Text>
        </View>

        {/* 카드 */}
        <View style={authStyles.card}>
          {/* 이름 */}
          <TextInput
            placeholder="이름"
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor={theme.colors.muted}
            style={authStyles.input}
          />
          <View style={authStyles.gapSm} />
          <TextInput
            placeholder="성"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor={theme.colors.muted}
            style={authStyles.input}
          />

          {/* 이메일 */}
          <View style={authStyles.gapSm} />
          <TextInput
            placeholder="이메일"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={theme.colors.muted}
            style={authStyles.input}
          />

          {/* 비밀번호 */}
          <View style={authStyles.gapSm} />
          <TextInput
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={theme.colors.muted}
            style={authStyles.input}
          />

          {/* 비밀번호 확인 */}
          <View style={authStyles.gapSm} />
          <TextInput
            placeholder="비밀번호 확인"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            placeholderTextColor={theme.colors.muted}
            style={authStyles.input}
          />

          <View style={authStyles.gapMd} />

          {/* CTA 버튼 */}
          <TouchableOpacity
            onPress={onSubmit}
            disabled={!canSubmit}
            activeOpacity={0.85}
            style={[authStyles.cta, { opacity: canSubmit ? 1 : 0.5 }]}
          >
            <Text style={authStyles.ctaText}>회원가입</Text>
          </TouchableOpacity>

          {/* 하단 링크 */}
          <TouchableOpacity
            onPress={() => nav.navigate('Login' as never)}
            style={authStyles.linkBox}
          >
            <Text style={authStyles.linkText}>
              이미 계정이 있으신가요? <Text style={authStyles.linkTextStrong}>로그인</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}