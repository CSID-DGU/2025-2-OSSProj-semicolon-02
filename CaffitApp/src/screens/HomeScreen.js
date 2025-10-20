import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.wrap}>
      <Text style={styles.h1}>개인 맞춤 카페인 코치</Text>
      <Text>오늘 섭취 총량: 0 mg (더미데이터)</Text>
      <Text style={styles.dim}>게이지/요약 카드 → 추후 컴포넌트로 분리</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  h1: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  dim: { color: '#777', marginTop: 6 },
});
