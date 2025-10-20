import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function PrimaryButton({ title, onPress }) {
  return (
    <Pressable style={styles.btn} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: '#FF8A3D', padding: 16, borderRadius: 12, alignItems: 'center' },
  text: { color: '#fff', fontWeight: '700' },
});
