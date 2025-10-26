import React from 'react';
import { Pressable, View, StyleSheet, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { theme } from '../styles/theme';

type Props = { onPress: () => void };

export default function AddTabButton({ onPress }: Props) {
  return (
    <View pointerEvents="box-none" style={styles.wrap}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: '##9b8e7d', borderless: true, radius: 40 }}
        style={styles.fab}
      >
        <Ionicons name="add" size={26} color="#FFF" />
      </Pressable>
    </View>
  );
}

const SIZE = 64;

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    right: 0,
    bottom: 22, // 탭바 상단에서 뜨게
  },
  fab: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.card,
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: Platform.select({ android: 8, ios: 0 }),
  },
});
