// screens/Add/DrinkLoader.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import { theme } from '../../styles/theme'; // ✅ screens/Add → ../../styles

const logo = require('../../../assets/img/logo.png'); // ✅ screens/Add → ../../assets

type Props = {
  visible: boolean;
  message?: string;
};

export default function DrinkLoader({ visible, message }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />

          <ActivityIndicator size="large" color={theme.colors.primary} />

          <Text style={styles.text}>
            {message ?? '음료 분석 중입니다...'}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 220,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  logo: {
    width: 52,
    height: 52,
    marginBottom: 12,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center',
  },
});