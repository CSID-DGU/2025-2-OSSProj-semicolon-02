import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

export default function MyScreen() {
  return (
    <SafeAreaView style={styles.wrap}>
      <Text style={styles.h1}>마이</Text>
      <Text>목표량/알림/계정 설정</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  h1: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
});
