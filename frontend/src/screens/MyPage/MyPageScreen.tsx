import React, { useState } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import {
  useNavigation,
  CompositeNavigationProp,
  NavigationProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MyPageStackParamList, RootStackParamList } from '../../navigation/types';
import { common } from '../../styles/common';
import { theme } from '../../styles/theme';
import { mypageStyles } from '../../styles/mypageStyles';
import AppHeader from '../../components/AppHeader';
import GoalTargetModal from './components/GoalTargetModal';

// 자식 스택 + 루트 스택 합성 네비 타입
type MyPageNav = CompositeNavigationProp<
  NativeStackNavigationProp<MyPageStackParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;
type RootNav = NavigationProp<RootStackParamList>;

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

export default function MyPageScreen() {
  const nav = useNavigation<MyPageNav>();
  // 부모 네비게이터를 RootNav로 명시
  const parentNav = nav.getParent<RootNav>();

  const [goalVisible, setGoalVisible] = useState(false);

  // 로컬 상태(백엔드 연동 전)
  const [period, setPeriod] = useState<'daily' | 'monthly'>('monthly');
  const [dailyTarget, setDailyTarget] = useState<number>(400);
  const [monthlyTarget, setMonthlyTarget] = useState<number>(12000);

  const shownLabel = period === 'daily' ? '일일 목표' : '월간 목표';
  const shownValue = period === 'daily' ? `${dailyTarget} mg` : `${monthlyTarget} mg`;

  // 네비게이션 헬퍼 (명시적 호출)
  const goAccountSettings = () => nav.navigate('AccountSettings');
  const goNotificationSettings = () => parentNav?.navigate('NotificationSettings');
  const goFavorites = () => parentNav?.navigate('Favorites');
  const goMyReports = () => parentNav?.navigate('MyReports');

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
              <Image source={{ uri: 'https://placehold.co/72x72/png' }} style={mypageStyles.avatar} />
              <View style={mypageStyles.profileInfo}>
                <Text style={mypageStyles.name}>홍길동</Text>
                <Text style={mypageStyles.subId}>1111</Text>
              </View>
            </View>

            <TouchableOpacity style={mypageStyles.editPill} onPress={goAccountSettings} activeOpacity={0.85}>
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

      {/* 목표 설정 모달 */}
      <GoalTargetModal
        visible={goalVisible}
        onClose={() => setGoalVisible(false)}
        onSaved={({ daily, monthly }) => {
          setDailyTarget(daily);
          setMonthlyTarget(monthly);
          setGoalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}
