import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { RootProps } from '../../navigation/AppNavigator';

export default function RecordScreen({ navigation }: RootProps<'Record'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>기록(Record)</Text>
      <Text>• 촬영(OCR) / 수동 입력 / 즐겨찾기 분기 (TODO)</Text>
      <View style={{ height: 8 }} />
      <Button title="홈으로" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 8 },
  title: { fontSize: 22, fontWeight: '700' },
});
