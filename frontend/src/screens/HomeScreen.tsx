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

import { fetchIntakes } from '../api/intakes';
import { IntakeDTO } from '../types/intake';

import { LineChart } from 'react-native-gifted-charts';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';


// AI 요약용
import {
  fetchCaffeineSummary,
  type CaffeineSummaryRes,
  type LatestDrinkPlan,
  type CurvePoint,
} from '../lib/aiHttp';

const formatDate = (d: Date) => d.toISOString().slice(0, 10);

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

const formatIsoHM = (iso?: string | null) => {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  } catch {
    return '-';
  }
};

export default function HomeScreen() {
  const navigation = useNavigation<RootNav>();

  const [limitMg, setLimitMg] = useState<number>(400);
  const [goalVisible, setGoalVisible] = useState(false);
  const [intakes, setIntakes] = useState<IntakeDTO[]>([]);

  const [todayMg, setTodayMg] = useState<number>(0);
  const [todayCount, setTodayCount] = useState<number>(0);

  // 로그인한 사용자 id (today-summary / sleep / AI 호출용)
  const [userId, setUserId] = useState<number | null>(null);

  // 수면 데이터 (홈 위젯용)
  const [yesterdaySleepAt, setYesterdaySleepAt] = useState<string | null>(null);
  const [todayWakeAt, setTodayWakeAt] = useState<string | null>(null);
  const [todaySleepId, setTodaySleepId] = useState<number | null>(null);

  // 홈 수면 위젯 편집용 상태 (미니 모듈)
  const [sleepEditVisible, setSleepEditVisible] = useState(false);
  const [tmpSleepAt, setTmpSleepAt] = useState('');
  const [tmpWakeAt, setTmpWakeAt] = useState('');

  // AI 요약 상태
  const [halfLifeHours, setHalfLifeHours] = useState<number | null>(null);
  const [halfLifeMethod, setHalfLifeMethod] = useState<string | null>(null);
  const [latestDrinkPlan, setLatestDrinkPlan] =
    useState<LatestDrinkPlan | null>(null);

  // 카페인 곡선 데이터 (그래프용)

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const changeDate = (delta: number) => {
    setSelectedDate(prev => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + delta);
      return next;
    });
  };

  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: selectedDate,
      mode: 'date',
      is24Hour: true,
      onChange: (_event, date) => {
        if (date) {
          setSelectedDate(date);   // 여기서 선택한 날짜로 갱신
        }
      },
    });
  };  

  const [curve, setCurve] = useState<CurvePoint[]>([]);

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

    const fetchCaffeineAI = useCallback(
    async (uid: number, baseDate?: Date) => {
      try {
        const dateObj = baseDate ?? new Date();
        const dateStr = formatDate(dateObj); // YYYY-MM-DD

        const data: CaffeineSummaryRes = await fetchCaffeineSummary(
          uid,
          dateStr,
        );
        console.log('[Home] AI summary', data);

        setHalfLifeHours(data.halfLifeHours ?? null);
        setHalfLifeMethod(data.halfLifeMethod ?? null);
        setLatestDrinkPlan(data.latestDrinkPlan ?? null);
        setCurve(data.curve ?? []);
      } catch (e) {
        console.log('[Home] fetchCaffeineAI error', e);
        setHalfLifeHours(null);
        setHalfLifeMethod(null);
        setLatestDrinkPlan(null);
        setCurve([]);
      }
    },
    [],
  );

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
        await fetchCaffeineAI(effectiveUserId);

        // 섭취 기록 조회 (intakes 테이블 데이터)
        const intakeData = await fetchIntakes(effectiveUserId);
        setIntakes(intakeData);
        console.log('[Home] 섭취 기록:', intakeData);
      } catch (err: unknown) {
        console.log('[Home] bootstrap error', err);
      }
    };

    bootstrap();
  }, [fetchTodaySummary, fetchTodaySleep, fetchCaffeineAI]);

  useFocusEffect(
    useCallback(() => {
      if (!userId) {
        return;
      }
      fetchTodaySummary(userId);
      fetchCaffeineAI(userId, selectedDate);
      // 필요하면 수면도 함께 새로고침
      // fetchTodaySleep(userId);
    }, [userId, selectedDate, fetchTodaySummary, fetchCaffeineAI]),
  );

  const reloadToday = useCallback(async () => {
    try {
      if (userId) {
        const data = await fetchIntakes(userId);
        setIntakes(data);
        await fetchTodaySummary(userId);
        await fetchCaffeineAI(userId, selectedDate);
      }
    } catch (e) {
      console.log('[Home] reloadToday error', e);
    }
  }, [userId, selectedDate, fetchTodaySummary, fetchCaffeineAI]);

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
    return intakes.filter(
      i => new Date(i.consumedAt).toDateString() === today,
    );
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

  const percent = Math.round((effectiveTodayMg / Math.max(limitMg, 1)) * 100);

  const curveChartData = useMemo(() => {
    if (curve.length === 0) return [];
  
    const sameDayPoints = curve
      .map((p) => {
        const d = new Date(p.time);
        return { value: p.caffeineMg, date: d };
      })
      .filter(({ date }) => {
        return (
          date.getFullYear() === selectedDate.getFullYear() &&
          date.getMonth() === selectedDate.getMonth() &&
          date.getDate() === selectedDate.getDate()
        );
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  
    return sameDayPoints.map(({ value, date }) => {
      const hh = date.getHours();
      const mm = date.getMinutes();
      const label = mm === 0 ? String(hh) : '';
      return { value, label };
    });
  }, [curve, selectedDate]);  

  // Y축 설정
  const yAxisConfig = useMemo(() => {
    if (curve.length === 0) {
      return {
        maxValue: 0,
        noOfSections: 0,
        yAxisLabelTexts: [] as string[],
      };
    }

    const maxCurve = Math.max(...curve.map(p => p.caffeineMg));
    // 허용치(limitMg)와 실제 곡선 중 더 큰 값을 기준으로 스케일링
    const baseMax = Math.max(maxCurve, limitMg);

    // 200 이하면 50 단위, 그 이상이면 100 단위로
    const roughStep = baseMax <= 200 ? 50 : 100;
    const sections = Math.max(1, Math.ceil(baseMax / roughStep));
    const maxValue = sections * roughStep;

    const yAxisLabelTexts: string[] = [];
    for (let i = 0; i <= sections; i += 1) {
      yAxisLabelTexts.push(String(i * roughStep));
    }

    return {
      maxValue,
      noOfSections: sections,
      yAxisLabelTexts,
    };
  }, [curve, limitMg]);
  

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
      await fetchCaffeineAI(userId, selectedDate);
    } catch (e) {
      console.log('[Home] save sleep error', e);
    }
  };

  // 반감기 카드용 라벨
  const halfLifeLabel =
    halfLifeHours != null ? `${halfLifeHours.toFixed(1)} h` : '-';

  const halfLifeNote = (() => {
    if (!halfLifeMethod) return '데이터 수집 중';
    if (halfLifeMethod === 'fixed_default') return '초기 기본값';
    if (halfLifeMethod === 'curve') return '최근 데이터 기반 추정치';
    if (halfLifeMethod === 'ml') return '개인화 모델 기반 추정치';
    return '개인 추정치';
  })();

  // 섭취 가능 요약용 메인 텍스트
  const intakePlanMain = useMemo(() => {
    if (!latestDrinkPlan) {
      return '아직 섭취 계획을 계산할 수 없습니다.';
    }

    if (!latestDrinkPlan.possible) {
      const reason = latestDrinkPlan.reason;
      if (reason === 'already_over_threshold') {
        return '오늘은 추가 카페인 섭취를 권장하지 않습니다.';
      }
      if (reason === 'no_safe_slot') {
        return '오늘 남은 시간에 안전한 섭취 시간이 없습니다.';
      }
      if (reason === 'target_sleep_at_is_past') {
        return '설정된 취침 시간이 지나 내일 기준으로 다시 계산합니다.';
      }
      return '오늘은 추가 카페인 섭취를 권장하지 않습니다.';
    }

    const latestHM = formatIsoHM(latestDrinkPlan.latestAllowedTime);
    const dose = latestDrinkPlan.doseMg ?? 80;

    if (latestHM === '-') {
      return '오늘은 한 잔 정도의 추가 섭취가 가능합니다.';
    }

    return `${latestHM}까지 약 ${dose}mg 1잔 섭취 가능`;
  }, [latestDrinkPlan]);

  // 섭취 가능 요약용 서브 텍스트 (상한선/수면 시 농도 설명)
  const intakePlanSub = useMemo(() => {
    if (!latestDrinkPlan) {
      return '수면·섭취 데이터를 더 수집하면 보다 정확한 계획이 제공됩니다.';
    }

    const atSleep = latestDrinkPlan.caffeineAtSleepIfDrink;
    const threshold = latestDrinkPlan.safeThreshold;

    if (!latestDrinkPlan.possible) {
      if (threshold != null) {
        return `현재 잔여 카페인이 설정된 수면 상한선(${threshold}mg)을 이미 초과했거나, 초과할 가능성이 높습니다.`;
      }
      return '현재 잔여 카페인이 높거나 오늘 남은 시간에 안전한 섭취 구간이 없습니다.';
    }

    if (atSleep != null && threshold != null) {
      return `해당 시간까지 마셔도 취침 시 잔여 카페인은 약 ${atSleep}mg, 설정 상한선은 ${threshold}mg입니다. 이후 섭취는 수면에 영향을 줄 수 있습니다.`;
    }

    if (atSleep != null) {
      return `해당 시간까지 마셔도 취침 시 잔여 카페인은 약 ${atSleep}mg 이하로 예상됩니다. 이후 섭취는 수면에 영향을 줄 수 있습니다.`;
    }

    return '해당 시간 이후 섭취는 수면에 영향을 줄 수 있어 피하는 편이 좋습니다.';
  }, [latestDrinkPlan]);

  // 섭취 조언 텍스트 (임시 플레이스홀더)
  const adviceText = (() => {
    if (!latestDrinkPlan) {
      return '충분한 데이터가 쌓이면 개인 맞춤 섭취 조언이 제공됩니다.';
    }
    return '현재 모델 기반 상세 조언은 준비 중입니다.';
  })();

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
            </View>

            <View style={homeStyles.statCard}>
              <Text style={homeStyles.statTitle}>평균 반감기</Text>
              <Text style={homeStyles.statValueBig}>{halfLifeLabel}</Text>
              <Text style={homeStyles.statNote}>{halfLifeNote}</Text>
            </View>
          </View>
        </View>

        {/* 그래프 카드 */}
        <View style={homeStyles.section}>
          <View style={homeStyles.statHeaderRow}>
            <Text style={homeStyles.sectionTitle}>카페인 그래프</Text>

            <View style={homeStyles.dateSelectorRow}>
              <TouchableOpacity
                style={homeStyles.dateArrowBtn}
                onPress={() => changeDate(-1)}
              >
                <Ionicons
                  name="chevron-back"
                  size={16}
                  color={theme.colors.text}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={openDatePicker}>
                <Text style={homeStyles.dateText}>
                  {formatDate(selectedDate)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={homeStyles.dateArrowBtn}
                onPress={() => changeDate(1)}
              >
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={homeStyles.chartCard}>
            {curveChartData.length === 0 ? (
              <Text style={common.subtle}>
                최근 1~2일 내 섭취/수면 데이터가 부족해 그래프를 표시할 수
                없습니다.
              </Text>
            ) : (
              <LineChart
                data={curveChartData}
                height={180}                     
                thickness={3}
                curved
                hideDataPoints
                initialSpacing={15}
                spacing={24}
                xAxisTextNumberOfLines={1}
                adjustToWidth
                areaChart={false}
                color={theme.colors.primary}
                dataPointsColor={theme.colors.primary}
                // ---- Y축 mg 단위 설정 ----
                maxValue={yAxisConfig.maxValue}
                noOfSections={yAxisConfig.noOfSections}
                yAxisLabelTexts={yAxisConfig.yAxisLabelTexts}
                yAxisTextStyle={{
                  fontSize: 10,
                  color: theme.colors.gray500,
                }}
                yAxisLabelWidth={32}
              />
            )}
          </View>
        </View>

        {/* 섭취 가능 요약 */}
        <View style={homeStyles.section}>
          <Text style={homeStyles.sectionTitle}>섭취 가능 요약</Text>
          <View style={homeStyles.intakePlanCard}>
            <Text style={homeStyles.intakePlanMain}>{intakePlanMain}</Text>
            <Text style={homeStyles.intakePlanSub}>{intakePlanSub}</Text>
          </View>
        </View>

        {/* 섭취 조언 (LLM/무카페인 추천용) */}
        <View style={homeStyles.section}>
          <Text style={homeStyles.sectionTitle}>섭취 조언</Text>
          <View style={homeStyles.adviceCard}>
            <Text style={common.body}>{adviceText}</Text>
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

      {/* 목표 설정 모달 */}
      <GoalTargetModal
        visible={goalVisible}
        onClose={() => setGoalVisible(false)}
        onSaved={async ({ daily, monthly }) => {
          try {
            setLimitMg(daily);
            setGoalVisible(false);

            const payload: StoredGoals = { daily, monthly };
            await AsyncStorage.setItem(
              'caffit:goals',
              JSON.stringify(payload),
            );
          } catch (e) {
            console.log('[Home] save goals error', e);
          }
        }}
      />
    </SafeAreaView>
  );
}
