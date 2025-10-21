import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { RootProps } from '../navigation/AppNavigator';

export default function LoginScreen({ navigation }: RootProps<'Login'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      {/* TODO: 이메일/비번 입력폼 */}
      <Button title="로그인" onPress={() => navigation.replace('Home')} />
      <View style={{ height: 8 }} />
      <Button title="회원가입" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
});
