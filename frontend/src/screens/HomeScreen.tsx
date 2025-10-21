import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { RootProps } from '../navigation/AppNavigator';

export default function HomeScreen({ navigation }: RootProps<'Home'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>홈</Text>
      <Text>오늘 카페인 섭취 요약/그래프 영역 (TODO)</Text>

      <View style={styles.row}>
        <Button title="기록(Record)" onPress={() => navigation.navigate('Record')} />
        <Button title="AI 리포트" onPress={() => navigation.navigate('Report')} />
      </View>
      <View style={styles.row}>
        <Button title="지도" onPress={() => navigation.navigate('Map')} />
        <Button title="마이페이지" onPress={() => navigation.navigate('MyPage')} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 12 },
});
