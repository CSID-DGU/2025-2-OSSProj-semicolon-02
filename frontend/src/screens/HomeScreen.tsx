import React from 'react';
import {SafeAreaView, View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {common} from '../styles/common';
import {homeStyles} from '../styles/homeStyles';
import SectionHeader from '../components/SectionHeader';
import StatCard from '../components/StatCard';
import {theme} from '../styles/theme';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/types';
import AppHeader from '../components/AppHeader';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<RootNav>();

  // 더미 데이터
  const todayMg = 180;
  const limitMg = 400;
  const percent = Math.min(100, Math.round((todayMg / limitMg) * 100));

  const openStatistics = () => {
    navigation.navigate('Statistics');
  };

  return (
    <SafeAreaView style={common.screen}>
      {/* ✅ 고정 헤더 */}
      <AppHeader title="카핏" />

      {/* ✅ 스크롤 콘텐츠 */}
      <ScrollView contentContainerStyle={[common.container]}>
        {/* 통계 전체보기 카드 */}
        <View style={homeStyles.section}>
          <SectionHeader title="통계" />
          <TouchableOpacity
            activeOpacity={0.85}
            style={[homeStyles.gaugeCard, {marginTop: theme.spacing(1)}]}
            onPress={openStatistics}>
            <View style={[common.rowBetween]}>
              <View>
                <Text style={homeStyles.gaugeValue}>{todayMg} mg</Text>
                <Text style={homeStyles.subtle}>오늘 섭취량</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={{fontSize: 24, fontWeight: '800', color: theme.colors.primary}}>
                  전체 보기
                </Text>
                <Text style={homeStyles.subtle}>나의 카페인 레포트로 이동</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* 게이지/요약 */}
        <View style={homeStyles.gaugeCard}>
          <View style={[common.rowBetween]}>
            <View>
              <Text style={homeStyles.gaugeValue}>{todayMg} mg</Text>
              <Text style={homeStyles.subtle}>현재 섭취량</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={{fontSize: 24, fontWeight: '800', color: theme.colors.primary}}>
                {percent}%
              </Text>
              <Text style={homeStyles.subtle}>달성(허용치 대비)</Text>
            </View>
          </View>
        </View>

        {/* 빠른 통계 */}
        <View style={homeStyles.section}>
          <SectionHeader title="요약" />
          <View style={[homeStyles.grid, {marginTop: theme.spacing(2)}]}>
            <StatCard title="오늘 음료" value={'2잔'} note="아메리카노 1, 라떼 1" />
            <StatCard title="평균 반감기" value={'5.2 h'} note="개인 추정치" />
          </View>
        </View>

        {/* 섭취 권고 */}
        <View style={homeStyles.section}>
          <SectionHeader title="섭취 권고" />
          <View
            style={{
              marginTop: theme.spacing(1),
              padding: theme.spacing(2),
              borderRadius: theme.radius.md,
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: theme.colors.line,
            }}>
            <Text style={common.body}>
              지금은 추가 섭취를 한 잔까지 허용합니다. 취침 6시간 전에는 카페인 섭취를 피하세요.
            </Text>
          </View>
        </View>

        {/* 그래프 자리 */}
        <View style={homeStyles.section}>
          <SectionHeader title="시간대별 농도(임시)" />
          <View
            style={{
              height: 160,
              marginTop: theme.spacing(1),
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: theme.colors.line,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={homeStyles.subtle}>그래프 라이브러리 연동 예정</Text>
          </View>
        </View>

        <View style={{height: theme.spacing(10)}} />
      </ScrollView>
    </SafeAreaView>
  );
}