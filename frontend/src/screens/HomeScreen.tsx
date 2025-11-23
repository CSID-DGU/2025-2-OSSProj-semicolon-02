// screens/HomeScreen.tsx (중요 부분만 발췌)

import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { common } from '../styles/common';
import { homeStyles } from '../styles/homeStyles';
import { theme } from '../styles/theme';
import AppHeader from '../components/AppHeader';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import GoalTargetModal from './MyPage/components/GoalTargetModal';

import { http } from '../lib/http';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

type TodaySummary = {
  totalCaffeineMg: number;
  count: number;
};

export default function HomeScreen() {
  const navigation = useNavigation<RootNav>();

  const [todayMg, setTodayMg] = useState<number>(0);
  const [todayCount, setTodayCount] = useState<number>(0);

  const [limitMg, setLimitMg] = useState<number>(400);
  const [goalVisible, setGoalVisible] = useState(false);

  const percent = Math.min(
    100,
    Math.round((todayMg / Math.max(limitMg, 1)) * 100),
  );

  useEffect(() => {
    // 헬스 체크는 그대로
    http
      .get('/api/health')
      .then(r => console.log('health:', r.data))
      .catch(e => console.log('health error:', e.message));

    // 오늘 섭취 요약
    // TODO: userId=1은 임시. 로그인 연동 후 실제 사용자 id로 교체 필요 (추측입니다).
    http
      .get<TodaySummary>('/api/intakes/today-summary', {
        params: { userId: 1 },
      })
      .then(res => {
        setTodayMg(res.data.totalCaffeineMg ?? 0);
        setTodayCount(res.data.count ?? 0);
      })
      .catch(err => {
        console.log('today-summary error', err?.message ?? err);
      });
  }, []);

  
  // 수면 데이터 (일단 더미 + 홈 위젯용)
  const [yesterdaySleepAt, setYesterdaySleepAt] = useState('01:30');
  const [todayWakeAt, setTodayWakeAt] = useState('08:00');

  // 수면 시간 계산(단순 HH:mm 기준, 자정 넘는 경우는 24시간 더해줌)
  const calcDurationLabel = () => {
    const [sh, sm] = yesterdaySleepAt.split(':').map(Number);
    const [wh, wm] = todayWakeAt.split(':').map(Number);
    const start = sh * 60 + sm;
    let end = wh * 60 + wm;
    if (end <= start) end += 24 * 60;
    const diff = end - start;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return m === 0 ? `${h}시간` : `${h}시간 ${m}분`;
  };
  const sleepDurationLabel = calcDurationLabel();

  // 홈 수면 위젯 편집용 상태 (미니 모듈)
  const [sleepEditVisible, setSleepEditVisible] = useState(false);
  const [tmpSleepAt, setTmpSleepAt] = useState(yesterdaySleepAt);
  const [tmpWakeAt, setTmpWakeAt] = useState(todayWakeAt);

  const openSettings = () => setGoalVisible(true);
  const openSleepHistory = () => navigation.navigate('SleepHistory');

  const openSleepEdit = () => {
    setTmpSleepAt(yesterdaySleepAt);
    setTmpWakeAt(todayWakeAt);
    setSleepEditVisible(true);
  };

  const saveSleepEdit = () => {
    setYesterdaySleepAt(tmpSleepAt);
    setTodayWakeAt(tmpWakeAt);
    setSleepEditVisible(false);
    // TODO: 이후 서버에 PATCH 호출 (/api/sleep-today 등)
  };

  return (
    <SafeAreaView style={common.screen}>
      <AppHeader
        showLogo
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: theme.spacing(14) }}>
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

 {/* 수면 요약 카드 */}
 <View style={homeStyles.sleepCard}>
        {/* 왼쪽: 아이콘 + 시간 3줄 */}
        <View style={homeStyles.sleepLeft}>
          <View style={homeStyles.sleepRow}>
            <Ionicons
              name="moon-outline"
              size={18}
              color={theme.colors.primaryDark}
              style={homeStyles.sleepIcon}
            />
            <Text style={homeStyles.sleepValue}>{yesterdaySleepAt}</Text>
            <Text style={homeStyles.sleepLabelSmall}>어제 취침</Text>
          </View>

          <View style={homeStyles.sleepRow}>
            <Ionicons
              name="alarm-outline"
              size={18}
              color={theme.colors.primaryDark}
              style={homeStyles.sleepIcon}
            />
            <Text style={homeStyles.sleepValue}>{todayWakeAt}</Text>
            <Text style={homeStyles.sleepLabelSmall}>오늘 기상</Text>
          </View>

          <View style={homeStyles.sleepRow}>
            <Ionicons
              name="bed-outline"
              size={18}
              color={theme.colors.primaryDark}
              style={homeStyles.sleepIcon}
            />
            <Text style={homeStyles.sleepValue}>{sleepDurationLabel}</Text>
            <Text style={homeStyles.sleepLabelSmall}>수면 시간</Text>
          </View>
        </View>

        {/* 오른쪽: 전체 기록 보기 + 수정 아이콘 */}
        <View style={homeStyles.sleepRight}>
          <TouchableOpacity
            style={homeStyles.sleepHistoryBtn}
            activeOpacity={0.8}
            onPress={openSleepHistory}
          >
            <Text style={homeStyles.sleepHistoryText}>전체 기록 보기</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.gray600}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={homeStyles.sleepEditBtn}
            onPress={openSleepEdit}
            activeOpacity={0.8}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={theme.colors.gray600}
            />
            <Text style={homeStyles.sleepEditText}>수정</Text>
          </TouchableOpacity>
        </View>
      </View>
        
        {/* 요약 */}
        <View style={homeStyles.section}>
          <View style={homeStyles.statRow}>
            <View style={homeStyles.statCard}>
              <Text style={homeStyles.statTitle}>오늘 음료</Text>
              <Text style={homeStyles.statValueBig}>{todayCount}잔</Text>
              <Text style={homeStyles.statNote}>즐겨찾기/직접등록 기준</Text>
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
          </View>
        </View>
        
      </ScrollView>
            {/* 수면 편집 미니 모듈 */}
            {sleepEditVisible && (
        <View style={homeStyles.sleepEditOverlay}>
          <View style={homeStyles.sleepEditCard}>
            <Text style={homeStyles.sleepEditTitle}>수면 시간 수정</Text>

            <View style={homeStyles.sleepEditRow}>
              <Text style={homeStyles.sleepLabel}>어제 취침</Text>
              <TextInput
                style={homeStyles.sleepInput}
                value={tmpSleepAt}
                onChangeText={setTmpSleepAt}
                placeholder="HH:MM"
              />
            </View>

            <View style={homeStyles.sleepEditRow}>
              <Text style={homeStyles.sleepLabel}>오늘 기상</Text>
              <TextInput
                style={homeStyles.sleepInput}
                value={tmpWakeAt}
                onChangeText={setTmpWakeAt}
                placeholder="HH:MM"
              />
            </View>

            <View style={homeStyles.sleepEditActions}>
              <TouchableOpacity
                style={homeStyles.sleepCancelBtn}
                onPress={() => setSleepEditVisible(false)}
              >
                <Text style={homeStyles.sleepCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={homeStyles.sleepSaveBtn}
                onPress={saveSleepEdit}
              >
                <Text style={homeStyles.sleepSaveText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

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