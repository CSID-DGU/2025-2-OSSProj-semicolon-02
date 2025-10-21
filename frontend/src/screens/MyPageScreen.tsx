import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MyPageScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>마이페이지</Text>
      <Text>프로필/목표/알림 설정 (TODO)</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 8 },
  title: { fontSize: 22, fontWeight: '700' },
});
