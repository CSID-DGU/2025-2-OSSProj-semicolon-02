// components/AppHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '../styles/theme';
import { fonts } from '../styles/common';
import logoImg from '../../assets/img/logo.png';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: () => void;
  showLogo?: boolean;
}

export default function AppHeader({
  title,
  right,
  onBack,
  showLogo,
}: AppHeaderProps) {
  return (
    <View style={[styles.container, showLogo && styles.containerWithLogo]}>
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backTxt}>←</Text>
          </TouchableOpacity>
        )}

        {showLogo && (
          <Image source={logoImg} style={styles.logo} resizeMode="contain" />
        )}

        <View>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      {right && <View>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing(theme.layout.screenPX),
    paddingTop: theme.spacing(theme.layout.headerPT + 1),
    paddingBottom: theme.spacing(1),
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.line,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  containerWithLogo: {
    paddingTop: theme.spacing(theme.layout.headerPT - 5),
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  backBtn: {
    paddingRight: 4,
    paddingBottom: 0,
    marginTop: -12,
  },
  backTxt: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
  },
  logo: {
    width: 50,
    height: 50,
    marginTop: -20,
    marginBottom: -20,
  },
  title: {
    ...fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    color: theme.colors.text,
  },
});
