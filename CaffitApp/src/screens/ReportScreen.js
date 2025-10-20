import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

export default function ReportScreen() {
  return (
    <SafeAreaView style={styles.wrap}>
      <Text style={styles.h1}>리포트</Text>
      <Text>일/주/월 패턴 + 반감기 추정 (추후 API 연동)</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  h1: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
});
