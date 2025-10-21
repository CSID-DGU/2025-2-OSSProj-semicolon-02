import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ReportScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI 리포트</Text>
      <Text>주/월별 섭취량, 권장량 대비, 수면 상관분석 (TODO)</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 8 },
  title: { fontSize: 22, fontWeight: '700' },
});
