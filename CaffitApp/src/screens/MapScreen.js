import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.wrap}>
      <Text style={styles.h1}>지도</Text>
      <Text>주변 카페(추후 추가)</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  h1: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
});
