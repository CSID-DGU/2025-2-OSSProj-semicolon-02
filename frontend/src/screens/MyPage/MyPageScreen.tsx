import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  // CompositeNavigationProp,
  // NavigationProp,
} from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import type { MyPageStackParamList, RootStackParamList } from '../../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { common } from '../../styles/common';
import { theme } from '../../styles/theme';
import { mypageStyles } from '../../styles/mypageStyles';
import AppHeader from '../../components/AppHeader';
import GoalTargetModal from './components/GoalTargetModal';

// // 자식 스택 + 루트 스택 합성 네비 타입
// type MyPageNav = CompositeNavigationProp<
//   NativeStackNavigationProp<MyPageStackParamList>,
//   NativeStackNavigationProp<RootStackParamList>
// >;
// type RootNav = NavigationProp<RootStackParamList>;

function RowLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={mypageStyles.row}>
      <View style={mypageStyles.rowLeft}>
        <Text style={mypageStyles.rowLabel}>{label}</Text>
      </View>
      <Text style={mypageStyles.rowArrow}>›</Text>
    </TouchableOpacity>
  );
}

type StoredUser = {
  id: number;
  name: string;
  email: string;
};

type StoredGoals = {
  daily: number;
  monthly: number;
};

export default function MyPageScreen() {
  const nav = useNavigation();
  const parentNav = nav.getParent();

  const [goalVisible, setGoalVisible] = useState(false);

  // 로그인 유저 정보
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  // 목표 값 (기본값은 예전과 동일)
  const [period, setPeriod] = useState<'daily' | 'monthly'>('monthly');
  const [dailyTarget, setDailyTarget] = useState<number>(400);
  const [monthlyTarget, setMonthlyTarget] = useState<number>(12000);

  const shownLabel = period === 'daily' ? '일일 목표' : '월간 목표';
  const shownValue = period === 'daily' ? `${dailyTarget} mg` : `${monthlyTarget} mg`;

  // 최초 마운트 시: 로그인 정보 + 목표 값 불러오기
  useEffect(() => {
    const loadUserAndGoals = async () => {
      try {
        // 1) 로그인 유저
        const rawUser = await AsyncStorage.getItem('caffit:user');
        if (rawUser) {
          const parsedUser: StoredUser = JSON.parse(rawUser);
          setUserName(parsedUser.name);
          setUserEmail(parsedUser.email);
        }

        // 2) 목표 값
        const rawGoals = await AsyncStorage.getItem('caffit:goals');
        if (rawGoals) {
          const parsedGoals: StoredGoals = JSON.parse(rawGoals);
          setDailyTarget(parsedGoals.daily);
          setMonthlyTarget(parsedGoals.monthly);
        }
      } catch (e) {
        console.log('[MyPage] loadUserAndGoals error', e);
      }
    };

    loadUserAndGoals();
  }, []);

  // 네비게이션 헬퍼 (명시적 호출)
  const goAccountSettings = () => nav.navigate('AccountSettings' as never);
  const goNotificationSettings = () => parentNav?.navigate('NotificationSettings' as never);
  const goFavorites = () => parentNav?.navigate('Favorites' as never);
  const goMyReports = () => parentNav?.navigate('MyReports' as never);

  return (
    <SafeAreaView style={common.screen}>
      <AppHeader title="마이 페이지" />
      <ScrollView contentContainerStyle={[common.container, { paddingTop: theme.spacing(2) }]}>
        {/* 상단 프로필 */}
        <View style={mypageStyles.hero}>
          <View style={mypageStyles.heroRow}>
            <Text style={mypageStyles.heroTitle}>프로필</Text>
          </View>

          <View style={mypageStyles.profileCard}>
            <View style={mypageStyles.profileLeft}>
              {/* 이미지 제거, 로그인 정보만 표시 */}
              <View style={mypageStyles.profileInfo}>
                <Text style={mypageStyles.name}>{userName || '로그인 사용자'}</Text>
                {userEmail ? <Text style={mypageStyles.subId}>{userEmail}</Text> : null}
              </View>
            </View>

            <TouchableOpacity
              style={mypageStyles.editPill}
              onPress={goAccountSettings}
              activeOpacity={0.85}
            >
              <Text style={mypageStyles.editPillTxt}>수정하기</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 목표 설정: 월간/일간 토글 & 값 표시 */}
        <View style={mypageStyles.goalCard}>
          <View style={mypageStyles.goalHeader}>
            <View>
              <Text style={mypageStyles.goalTitle}>목표 설정</Text>
              <Text style={mypageStyles.goalSub}>섭취량</Text>
            </View>

            <View style={mypageStyles.segment}>
              <TouchableOpacity
                onPress={() => setPeriod('daily')}
                activeOpacity={0.85}
                style={[mypageStyles.segBtn, period === 'daily' && mypageStyles.segBtnActive]}
              >
                <Text style={mypageStyles.segTxt}>일간</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setPeriod('monthly')}
                activeOpacity={0.85}
                style={[mypageStyles.segBtn, period === 'monthly' && mypageStyles.segBtnActive]}
              >
                <Text style={mypageStyles.segTxt}>월간</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={mypageStyles.goalValueBox}>
            <View style={mypageStyles.goalValueRow}>
              <Text style={mypageStyles.goalLabel}>{shownLabel}</Text>
              <Text style={mypageStyles.goalValue}>{shownValue}</Text>
            </View>

            <TouchableOpacity
              onPress={() => setGoalVisible(true)}
              activeOpacity={0.85}
              style={[mypageStyles.editPill, { alignSelf: 'flex-end', marginTop: theme.spacing(1) }]}
            >
              <Text style={mypageStyles.editPillTxt}>목표 변경</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 설정 목록 */}
        <View style={mypageStyles.sectionCard}>
          <View style={mypageStyles.sectionHeader}>
            <Text style={mypageStyles.sectionTitle}>설정</Text>
          </View>

          <RowLink label="알림 설정" onPress={goNotificationSettings} />
          <RowLink label="즐겨찾기 관리" onPress={goFavorites} />
          <RowLink label="나의 카페인 레포트" onPress={goMyReports} />
        </View>

        <View style={{ height: theme.spacing(12) }} />
      </ScrollView>

      {/* 목표 설정 모달: 저장 시 AsyncStorage 반영 */}
      <GoalTargetModal
        visible={goalVisible}
        onClose={() => setGoalVisible(false)}
        onSaved={async ({ daily, monthly }) => {
          try {
            setDailyTarget(daily);
            setMonthlyTarget(monthly);
            setGoalVisible(false);

            const payload: StoredGoals = { daily, monthly };
            await AsyncStorage.setItem('caffit:goals', JSON.stringify(payload));
          } catch (e) {
            console.log('[MyPage] save goals error', e);
          }
        }}
      />
    </SafeAreaView>
  );
}
