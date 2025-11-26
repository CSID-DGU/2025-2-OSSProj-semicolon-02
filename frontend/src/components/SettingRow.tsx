import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {theme} from '../styles/theme';

type Props = {
  label: string;
  right?: React.ReactNode; // <Switch />나 아이콘 등
};

export default function SettingRow({label, right}: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.line,
  },
  label: {fontSize: 14, color: theme.colors.text},
});
