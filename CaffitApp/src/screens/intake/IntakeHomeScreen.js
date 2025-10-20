import React from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';

export default function IntakeHomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.wrap}>
      <Text style={styles.h1}>기록</Text>

      <View style={styles.gap}>
        <PrimaryButton
          title="📷 촬영 등록(OCR)"
          onPress={() => {/* 추후 OCR 화면으로 */}}
        />
        <PrimaryButton
          title="⌨️ 수동 입력"
          onPress={() => navigation.navigate('ManualIntake')}
        />
        <PrimaryButton
          title="⭐ 즐겨찾기에서 선택"
          onPress={() => {/* 추후 즐겨찾기 화면으로 */}}
        />
      </View>

      <Text style={styles.tip}>지금은 흐름만 확인 (저장/집계는 추후)</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20 },
  h1: { fontSize: 22, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  gap: { gap: 12 },
  tip: { textAlign: 'center', color: '#777', marginTop: 12 },
});
