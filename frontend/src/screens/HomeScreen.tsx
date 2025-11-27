// screens/HomeScreen.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { common } from '../styles/common';
import { homeStyles } from '../styles/homeStyles';
import { theme } from '../styles/theme';
import AppHeader from '../components/AppHeader';

import type { RootStackParamList } from '../navigation/types';
import GoalTargetModal from './MyPage/components/GoalTargetModal';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { http } from '../lib/http';

//import type { AxiosResponse } from 'axios';
import { fetchIntakes } from '../api/intakes';
import { IntakeDTO } from '../types/intake';
type RootNav = NativeStackNavigationProp<RootStackParamList>;

type TodaySummary = {
  totalCaffeineMg: number;
  count: number;
};

type StoredUser = {
  id: number;
  name: string;
  email: string;
};

type StoredGoals = {
  daily: number;
  monthly: number;
};

type TodaySleep = {
  exists: boolean;
  sleepAt: string | null;
  id: number | null;
  wakeAt: string | null;
  durationMinutes: number | null;
};

const extractTimeHM = (iso: string) => {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

const buildSleepDateTimes = (sleepHM: string, wakeHM: string) => {
  const now = new Date();
  const [sh, sm] = sleepHM.split(':').map(Number);
  const [wh, wm] = wakeHM.split(':').map(Number);

  const wake = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    wh,
    wm,
    0,
    0,
  );
  const sleep = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    sh,
    sm,
    0,
    0,
  );

  // 취침 시간이 기상 시간보다 늦으면 전날로 간주
  if (sleep.getTime() >= wake.getTime()) {
    sleep.setDate(sleep.getDate() - 1);
  }

  const toLocalDateTimeString = (date: Date) => {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm2 = String(date.getMinutes()).padStart(2, '0');
    const ss = '00';
    // LocalDateTime에 맞게 타임존 없는 형태로 보냄
    return `${yyyy}-${MM}-${dd}T${hh}:${mm2}:${ss}`;
  };

  return {
    sleepAt: toLocalDateTimeString(sleep),
    wakeAt: toLocalDateTimeString(wake),
  };
};

export default function HomeScreen() {
  const navigation = useNavigation<RootNav>();
  const [limitMg, setLimitMg] = useState<number>(400);
  const [goalVisible, setGoalVisible] = useState(false);
  const [intakes, setIntakes] = useState<IntakeDTO[]>([]);

  const [todayMg, setTodayMg] = useState<number>(0);
  const [todayCount, setTodayCount] = useState<number>(0);

  // 로그인한 사용자 id (today-summary / sleep 호출용)
  const [userId, setUserId] = useState<number | null>(null);

  // 수면 데이터 (홈 위젯용)
  const [yesterdaySleepAt, setYesterdaySleepAt] = useState<string | null>(null);
  const [todayWakeAt, setTodayWakeAt] = useState<string | null>(null);
  const [todaySleepId, setTodaySleepId] = useState<number | null>(null);

  // 홈 수면 위젯 편집용 상태 (미니 모듈)
  const [sleepEditVisible, setSleepEditVisible] = useState(false);
  const [tmpSleepAt, setTmpSleepAt] = useState('');
  const [tmpWakeAt, setTmpWakeAt] = useState('');

  const fetchTodaySummary = useCallback(async (uid: number) => {
    try {
      const res = await http.get<TodaySummary>('/api/intakes/today-summary', {
        params: { userId: uid },
      });
      console.log('[Home] today-summary res', res.data);
      setTodayMg(res.data.totalCaffeineMg ?? 0);
      setTodayCount(res.data.count ?? 0);
    } catch (e) {
      console.log('[Home] today-summary error', e);
    }
  }, []);

  const fetchTodaySleep = useCallback(async (uid: number) => {
    try {
      const res = await http.get<TodaySleep>('/api/sleep/today', {
        params: { userId: uid },
      });
      console.log('[Home] sleep today res', res.data);

      if (res.data.exists && res.data.sleepAt && res.data.wakeAt) {
        const sleepHM = extractTimeHM(res.data.sleepAt);
        const wakeHM = extractTimeHM(res.data.wakeAt);
        setYesterdaySleepAt(sleepHM);
        setTodayWakeAt(wakeHM);
        setTodaySleepId(res.data.id ?? null);
      } else {
        setYesterdaySleepAt(null);
        setTodayWakeAt(null);
        setTodaySleepId(null);
      }
    } catch (e) {
      console.log('[Home] sleep today error', e);
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        let effectiveUserId = 1; // fallback
        const rawUser = await AsyncStorage.getItem('caffit:user');
        if (rawUser) {
          const parsedUser: StoredUser = JSON.parse(rawUser);
          if (parsedUser.id) {
            effectiveUserId = parsedUser.id;
            setUserId(parsedUser.id);
          }
        } else {
          setUserId(effectiveUserId);
        }

        const rawGoals = await AsyncStorage.getItem('caffit:goals');
        if (rawGoals) {
          const parsedGoals: StoredGoals = JSON.parse(rawGoals);
          setLimitMg(parsedGoals.daily);
        }

        http
          .get('/api/health')
          .then(r => console.log('health:', r.data))
          .catch(e => console.log('health error:', e.message));

        await fetchTodaySummary(effectiveUserId);
        await fetchTodaySleep(effectiveUserId);

        // 섭취 기록 조회 (intakes 테이블 데이터)
        const intakeData = await fetchIntakes(effectiveUserId);
        setIntakes(intakeData);
        console.log('[Home] 섭취 기록:', intakeData);
      } catch (err: unknown) {
        console.log('[Home] bootstrap error', err);
      }
    };

    bootstrap();
  }, [fetchTodaySummary, fetchTodaySleep]);

  useFocusEffect(
    useCallback(() => {
      if (!userId) {
        return;
      }
      fetchTodaySummary(userId);
      // fetchTodaySleep(userId);
    }, [userId, fetchTodaySummary]),
  );

  const reloadToday = useCallback(async () => {
    try {
      if (userId) {
        const data = await fetchIntakes(userId);
        setIntakes(data);
        await fetchTodaySummary(userId);
      }
    } catch (e) {
      console.log('[Home] reloadToday error', e);
    }
  }, [userId, fetchTodaySummary]);

  // 수면 시간 계산
  const calcDurationLabel = () => {
    if (!yesterdaySleepAt || !todayWakeAt) {
      return '-';
    }
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

  useEffect(() => {
    http
      .get('/api/health')
      .then(r => console.log('health:', r.data)) // 기대 출력: "OK"
      .catch(e => console.log('health error:', e.message));
  }, []);

  // 오늘 섭취한 음료 목록
  const todayIntakes = useMemo(() => {
    const today = new Date().toDateString();
    return intakes.filter(i => new Date(i.consumedAt).toDateString() === today);
  }, [intakes]);

  const todayDrinksText = todayIntakes
    .map(i => i.note || i.beverageName || '음료')
    .join(', ');

  // todayMg는 서버에서 가져온 값(setTodayMg)과 로컬 계산값 중 서버 값 우선
  const localTodayMg = useMemo(() => {
    const today = new Date().toDateString();
    return intakes
      .filter(i => new Date(i.consumedAt).toDateString() === today)
      .reduce((sum, i) => sum + i.caffeineMg, 0);
  }, [intakes]);

  const effectiveTodayMg = todayMg > 0 ? todayMg : localTodayMg;

  const percent = Math.min(
    100,
    Math.round((effectiveTodayMg / Math.max(limitMg, 1)) * 100),
  );

  const openSettings = () => setGoalVisible(true);
  const openSleepHistory = () => navigation.navigate('SleepHistory');

  const openSleepEdit = () => {
    setTmpSleepAt(yesterdaySleepAt ?? '');
    setTmpWakeAt(todayWakeAt ?? '');
    setSleepEditVisible(true);
  };

  const saveSleepEdit = async () => {
    if (!userId) {
      console.log('[Home] no userId, cannot save sleep');
      return;
    }

     console.log('[Home] saveSleepEdit userId =', userId);
    setYesterdaySleepAt(tmpSleepAt);
    setTodayWakeAt(tmpWakeAt);
    setSleepEditVisible(false);

    try {
      const { sleepAt, wakeAt } = buildSleepDateTimes(tmpSleepAt, tmpWakeAt);

      if (todaySleepId) {
        await http.put(`/api/sleep/${todaySleepId}`, {
          sleepAt,
          wakeAt,
        });
        console.log('[Home] sleep updated');
      } else {
        await http.post('/api/sleep', {
          userId,
          sleepAt,
          wakeAt,
        });
        console.log('[Home] sleep created');
      }

      await fetchTodaySleep(userId);
    } catch (e) {
      console.log('[Home] save sleep error', e);
    }
  };

  return (
    <SafeAreaView style={common.screen}>
      <AppHeader showLogo />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: theme.spacing(14) }}
      >
        {/* 오늘의 카페인 통합 위젯 */}
        <View style={homeStyles.caffeineWidget}>
          {/* 헤더 */}
          <View style={homeStyles.widgetHeaderRow}>
            <View>
              <Text style={homeStyles.widgetTitle}>오늘의 카페인</Text>
              <Text style={homeStyles.widgetSubTitle}>
                허용치 {limitMg}mg 기준
              </Text>
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
              <Text style={homeStyles.widgetMg}>{effectiveTodayMg} mg</Text>
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
              >
                <Text style={homeStyles.statTitle}>오늘 음료</Text>
                <TouchableOpacity
                  onPress={reloadToday}
                  style={{ marginLeft: 6, padding: 4 }}
                >
                  <Ionicons
                    name="refresh"
                    size={14}
                    color={theme.colors.gray600}
                  />
                </TouchableOpacity>
              </View>

              <Text style={homeStyles.statValueBig}>
                {todayIntakes.length}잔
              </Text>
              <Text style={homeStyles.statNote}>
                {todayDrinksText || '오늘 섭취한 음료가 없습니다'}
              </Text>
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
            <Text style={common.subtle}>
              시간대별 카페인 농도(그래프 연동 예정)
            </Text>
          </View>
        </View>

        {/* 섭취 권고 */}
        <View style={homeStyles.section}>
          <Text style={homeStyles.sectionTitle}>섭취 조언</Text>
          <View style={homeStyles.adviceCard}>
            <Text style={common.body}>
              지금은 추가 섭취를 한 잔까지 허용합니다. 취침 6시간 전에는 카페인
              섭취를 피하세요.
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

      {/* 목표 설정 모달: 저장 시 허용치(limitMg) + AsyncStorage 동기화 */}
      <GoalTargetModal
        visible={goalVisible}
        onClose={() => setGoalVisible(false)}
        onSaved={async ({ daily, monthly }) => {
          try {
            setLimitMg(daily);
            setGoalVisible(false);

            const payload: StoredGoals = { daily, monthly };
            await AsyncStorage.setItem('caffit:goals', JSON.stringify(payload));
          } catch (e) {
            console.log('[Home] save goals error', e);
          }
        }}
      />
    </SafeAreaView>
  );
}
