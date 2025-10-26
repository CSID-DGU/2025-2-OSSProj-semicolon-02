import React from 'react';
import {View, Text} from 'react-native';
import {common} from '../styles/common';

export default function SectionHeader({title, right}: {title: string; right?: React.ReactNode}) {
  return (
    <View style={common.rowBetween}>
      <Text style={common.h2}>{title}</Text>
      {right}
    </View>
  );
}
