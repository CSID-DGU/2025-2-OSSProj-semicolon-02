import React from 'react';
import {View, Text} from 'react-native';
import {theme} from '../styles/theme';

type Props = { title: string; value: string; note?: string };

export default function StatCard({title, value, note}: Props) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: '#FFFFFF',
      borderRadius: theme.radius.md,
      padding: theme.spacing(2),
      borderWidth: 1, borderColor: theme.colors.line,
      ...theme.shadow.card,
    }}>
      <Text style={{fontSize: 12, color: theme.colors.gray500}}>{title}</Text>
      <Text style={{fontSize: 20, fontWeight: '800', color: theme.colors.text, marginTop: 6}}>
        {value}
      </Text>
      {!!note && <Text style={{fontSize: 12, color: theme.colors.gray500, marginTop: 4}}>{note}</Text>}
    </View>
  );
}
