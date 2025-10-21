import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { RootProps } from '../navigation/AppNavigator';

export default function RegisterScreen({ navigation }: RootProps<'Register'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      {/* TODO: 폼 입력 */}
      <Button title="가입 완료 → 로그인" onPress={() => navigation.replace('Login')} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
});
