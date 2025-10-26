import React from 'react';
import {View, Text, Switch} from 'react-native';
import {common} from '../styles/common';
import {theme} from '../styles/theme';

export default function MyPageScreen() {
  return (
    <View style={[common.screen, common.container]}>
      <View style={{paddingTop: 24, paddingBottom: 12}}>
        <Text style={common.h1}>마이 페이지</Text>
      </View>

      <View style={{
        backgroundColor: '#fff',
        borderRadius: theme.radius.md,
        padding: 16,
        borderWidth: 1, borderColor: theme.colors.line,
      }}>
        <Text style={{fontWeight: '700', fontSize: 16}}>목표/알림</Text>

        <View style={{marginTop: 16, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>일일 허용치 초과 알림</Text>
          <Switch value />
        </View>

        <View style={{marginTop: 16, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>취침 전 차단 알림</Text>
          <Switch />
        </View>
      </View>
    </View>
  );
}
