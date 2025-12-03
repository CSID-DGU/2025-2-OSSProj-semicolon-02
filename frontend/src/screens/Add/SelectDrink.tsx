import React, {memo, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  ToastAndroid,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import {common} from '../../styles/common';
import {theme} from '../../styles/theme';
import {http} from '../../lib/http';
import {getCurrentUser} from '../../lib/authSession';

// 인식된 음료 후보 타입
type DrinkCandidate = {
  id: string;
  name: string;
  brand: string;
  volumeText?: string;
  volumeMl: number;
  caffeineMg: number;
};

// 임시 DEMO 후보 데이터 (나중에 Vision 결과로 교체)
const DEMO_CANDIDATES: DrinkCandidate[] = [
  {
    id: '1',
    name: '아이스 아메리카노',
    brand: '메가커피',
    volumeText: '라지 / 24oz',
    volumeMl: 710,
    caffeineMg: 237,
  },
  {
    id: '2',
    name: '디카페인 아메리카노',
    brand: '메가커피',
    volumeText: '라지 / 24oz',
    volumeMl: 710,
    caffeineMg: 15,
  },
];

const CandidateRow = memo(function CandidateRow({
  item,
  onSelect,
}: {
  item: DrinkCandidate;
  onSelect: (v: DrinkCandidate) => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onSelect(item)}
      style={styles.rowCard}>
      <View style={styles.rowTextWrap}>
        <Text numberOfLines={1} style={styles.rowTitle}>
          {item.name}
        </Text>
        <Text numberOfLines={1} style={styles.rowSub}>
          {item.brand}
          {item.volumeText ? ` · ${item.volumeText}` : ''}
        </Text>
      </View>

      <Text style={styles.caffeine}>{item.caffeineMg} mg</Text>
    </TouchableOpacity>
  );
});

export default function DrinkSelectScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();

  // CameraAddScreen 에서 넘긴 값
  const imageUri: string | undefined = route.params?.imageUri;
  const candidatesFromRoute: DrinkCandidate[] | undefined =
    route.params?.candidates;

  // 후보 리스트 (나중에 route.params.candidates 를 쓰면 됨)
  const list = useMemo(
    () => candidatesFromRoute ?? DEMO_CANDIDATES,
    [candidatesFromRoute],
  );

  const handleSelect = useCallback(
    async (item: DrinkCandidate) => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          Alert.alert('로그인 필요', '다시 로그인 후 이용해 주세요.');
          nav.navigate('Login');
          return;
        }

        // 즐겨찾기 화면과 동일하게 manual intake API 사용
        await http.post('/api/intakes/manual', {
          userId: user.id,
          brand: item.brand,
          name: item.name,
          caffeineMg: item.caffeineMg,
          volumeMl: item.volumeMl,
          note: `${item.brand} ${item.name}`,
          consumedAt: null,
        });

        if (Platform.OS === 'android') {
          ToastAndroid.show('섭취 기록을 등록했습니다.', ToastAndroid.SHORT);
        }

        nav.navigate('Tabs', {screen: 'Home'});
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.log('drink-select add error', e.message);
        } else {
          console.log('drink-select unknown error', e);
        }
        Alert.alert('오류', '기록 저장 중 문제가 발생했습니다.');
      }
    },
    [nav],
  );

  return (
    <SafeAreaView style={common.screen}>
      <AppHeader title="음료 최종 선택" />

      <View style={[common.container, {paddingTop: theme.spacing(2)}]}>
        {/* 상단: 찍은 사진 프리뷰 */}
        {imageUri && (
          <View style={styles.imageBox}>
            <Image
              source={{uri: imageUri}}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        {/* 안내 문구 */}
        <Text style={styles.guideText}>
          아래 후보 중에서 실제로 마신 음료를 선택해 주세요.
        </Text>

        {/* 후보 리스트 */}
        <FlatList
          data={list}
          keyExtractor={it => it.id}
          renderItem={({item}) => (
            <CandidateRow item={item} onSelect={handleSelect} />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={{paddingVertical: theme.spacing(4)}}>
              <Text style={styles.emptyText}>
                인식된 음료 후보가 없습니다.{'\n'}다시 촬영해 주세요.
              </Text>
            </View>
          }
          contentContainerStyle={{paddingBottom: theme.spacing(4)}}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageBox: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: theme.spacing(2),
    backgroundColor: '#111',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  guideText: {
    fontSize: 14,
    color: '#666',
    marginBottom: theme.spacing(2),
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: Platform.OS === 'android' ? 1 : 0,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  rowTextWrap: {
    flex: 1,
    marginRight: 8,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  rowSub: {
    marginTop: 2,
    fontSize: 13,
    color: '#777',
  },
  caffeine: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5E6AD2',
  },
  separator: {
    height: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
    lineHeight: 18,
  },
});