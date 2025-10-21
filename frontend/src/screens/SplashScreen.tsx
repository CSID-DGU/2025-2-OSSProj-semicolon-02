import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { RootProps } from '../navigation/AppNavigator';

export default function SplashScreen({ navigation }: RootProps<'Splash'>) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Login'), 900);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator />
      <Text style={styles.title}>Caffit 로딩 중…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { marginTop: 12, fontSize: 18, fontWeight: '600' },
});
