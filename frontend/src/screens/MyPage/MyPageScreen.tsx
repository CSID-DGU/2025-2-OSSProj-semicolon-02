import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MyPageStackParamList, RootStackParamList } from '../../navigation/types';
import { common } from '../../styles/common';
import { theme } from '../../styles/theme';
import { mypageStyles } from '../../styles/mypageStyles';
import AppHeader from '../../components/AppHeader';
import GoalTargetModal from './components/GoalTargetModal';
import { useState } from 'react';

// MyPage 스택용 네비 타입
type MyPageNav = NativeStackNavigationProp<MyPageStackParamList>;
// (루트로 올려탈 때 타입이 필요하면 아래처럼 보조 타입 둬도 됩니다.)
// type RootNav = NativeStackNavigationProp<RootStackParamList>;

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
  const [goalVisible, setGoalVisible] = useState(false);

  return (
    <SafeAreaView style={common.screen}>
      <AppHeader title="마이 페이지" />

      <ScrollView contentContainerStyle={[common.container, { paddingTop: theme.spacing(2) }]}>
        {/* 상단 영역/프로필 */}
        <View style={mypageStyles.hero}>
          <View style={mypageStyles.heroRow}>
            <Text style={mypageStyles.heroTitle}>프로필</Text>
          </View>

          <View style={mypageStyles.profileCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={{ uri: 'https://placehold.co/72x72/png' }} style={mypageStyles.avatar} />
              <View style={{ marginLeft: 12 }}>
                <Text style={mypageStyles.name}>홍길동</Text>
                <Text style={mypageStyles.subId}>1111</Text>
              </View>
            </View>
            <TouchableOpacity
              style={mypageStyles.editPill}
              onPress={() => nav.navigate('AccountSettings')}
              activeOpacity={0.85}
            >
              <Text style={mypageStyles.editPillTxt}>수정하기</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 목표 설정 카드 */}
        <View style={mypageStyles.goalCard}>
          <View style={mypageStyles.goalHeader}>
            <View>
              <Text style={mypageStyles.goalTitle}>목표 설정</Text>
              <Text style={mypageStyles.goalSub}>섭취량</Text>
            </View>

            <TouchableOpacity
              onPress={() => setGoalVisible(true)}
              style={mypageStyles.dropdownPill}
              activeOpacity={0.85}
            >
              <Text style={mypageStyles.dropdownTxt}>월간 ▾</Text>
            </TouchableOpacity>
          </View>

          <View style={mypageStyles.donutWrap}>
            <View style={mypageStyles.donutOuter} />
            <View style={mypageStyles.donutInner}>
              <Text style={mypageStyles.donutPercent}>65%</Text>
            </View>
          </View>
        </View>

        {/* 설정 목록 */}
        <View style={mypageStyles.sectionCard}>
          <View style={mypageStyles.sectionHeader}>
            <Text style={mypageStyles.sectionTitle}>설정</Text>
            <TouchableOpacity hitSlop={8}>
              <Text style={mypageStyles.sectionSeeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <RowLink label="알림 설정" onPress={() => nav.navigate('NotificationSettings')} />
          <RowLink label="즐겨찾기 관리" onPress={() => nav.navigate('FavoritesManage')} />

          {/*  루트 스택 화면으로 이동 → 부모 네비게이터 통해 올려타기 */}
          <RowLink
            label="나의 카페인 레포트"
            onPress={() => nav.getParent()?.navigate('MyReports')}
          />
        </View>

        <View style={{ height: theme.spacing(12) }} />
      </ScrollView>

      {/* 목표 설정 모달 */}
      <GoalTargetModal
        visible={goalVisible}
        onClose={() => setGoalVisible(false)}
        onSaved={() => setGoalVisible(false)}
      />
    </SafeAreaView>
  );
}
