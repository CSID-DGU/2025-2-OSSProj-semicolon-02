import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { common } from '../styles/common';
import { homeStyles } from '../styles/homeStyles';
import { theme } from '../styles/theme';
import AppHeader from '../components/AppHeader';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import GoalTargetModal from './MyPage/components/GoalTargetModal';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

//type HomeNav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  //const navigation = useNavigation<HomeNav>();
  const navigation = useNavigation<RootNav>();

  // TODO: Add 화면과 실제 연동
  const todayMg = 180;              
  const [limitMg, setLimitMg] = useState<number>(400); 
  const [goalVisible, setGoalVisible] = useState(false);
  const percent = Math.min(100, Math.round((todayMg / Math.max(limitMg, 1)) * 100));

  const openSettings = () => setGoalVisible(true);

  return (
    <SafeAreaView style={homeStyles.screenBG}>
      <AppHeader title="카핏" />

      <ScrollView contentContainerStyle={{ paddingBottom: theme.spacing(12) }}>
        {/* 오늘의 카페인 통합 위젯 */}
        <View style={homeStyles.caffeineWidget}>
          {/* 헤더 */}
          <View style={homeStyles.widgetHeaderRow}>
            <View>
              <Text style={homeStyles.widgetTitle}>오늘의 카페인</Text>
              <Text style={homeStyles.widgetSubTitle}>허용치 {limitMg}mg 기준</Text>
            </View>
            <TouchableOpacity
              onPress={openSettings}
              style={homeStyles.widgetIconBtn}
              activeOpacity={0.85}
            >
              <Ionicons name="settings-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* 수치 */}
          <View style={homeStyles.widgetContentRow}>            
            <View style={homeStyles.widgetLeft}>
              <Text style={homeStyles.widgetMg}>{todayMg} mg</Text>
              <Text style={homeStyles.widgetLabel}>현재 섭취량</Text>
            </View>
            <View style={homeStyles.widgetRight}>
              <Text style={homeStyles.widgetPercent}>{percent}%</Text>
              <Text style={homeStyles.widgetLabel}>허용치 대비</Text>
            </View>
          </View>
        </View>

        {/* 게이지/요약 */}
        <View style={homeStyles.gaugeCard}>
          <View style={[common.rowBetween]}>
            <View>
              <Text style={homeStyles.gaugeValue}>{todayMg} mg</Text>
              <Text style={homeStyles.subtle}>현재 섭취량</Text>
            </View>
            <View style={homeStyles.statCard}>
              <Text style={homeStyles.statTitle}>평균 반감기</Text>
              <Text style={homeStyles.statValueBig}>5.2 h</Text>
              <Text style={homeStyles.statNote}>개인 추정치</Text>
            </View>
          </View>
        </View>

        {/* 그래프 카드 */}
        <View style={homeStyles.section}>
          <Text style={homeStyles.sectionTitle}>카페인 그래프</Text>
          <View style={homeStyles.chartCard}>
            <Text style={common.subtle}>시간대별 카페인 농도(그래프 연동 예정)</Text>
          </View>
        </View>

        {/* 섭취 권고 */}
        <View style={homeStyles.section}>
          <Text style={homeStyles.sectionTitle}>섭취 조언</Text>
          <View style={homeStyles.adviceCard}>
          <Text style={common.body}>
            지금은 추가 섭취를 한 잔까지 허용합니다. 취침 6시간 전에는 카페인 섭취를 피하세요.
          </Text>
          <SectionHeader title="섭취 권고" />
          <View
            style={{
              marginTop: theme.spacing(1),
              padding: theme.spacing(2),
              borderRadius: theme.radius.md,
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: theme.colors.line,
            }}
          >
            <Text style={common.body}>
              지금은 추가 섭취를 한 잔까지 허용합니다. 취침 6시간 전에는 카페인
              섭취를 피하세요.
            </Text>
          </View>
        </View>

        {/* 그래프 자리는 임시 박스로 표기 */}
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
            }}
          >
            <Text style={homeStyles.subtle}>그래프 라이브러리 연동 예정</Text>
          </View>
        </View>

        <View style={{ height: theme.spacing(10) }} />
        
      </ScrollView>
      {/* 목표 설정 모달: 저장 시 허용치(limitMg) 즉시 갱신 */}
      <GoalTargetModal
        visible={goalVisible}
        onClose={() => setGoalVisible(false)}
        onSaved={({ daily /*, monthly*/ }) => {
          setLimitMg(daily);    // 홈 위젯은 일간 
          setGoalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

