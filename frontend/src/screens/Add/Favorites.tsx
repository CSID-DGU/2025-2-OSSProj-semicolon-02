// screens/Add/Favorites.tsx
import React, {memo, useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import {common} from '../../styles/common';
import {theme} from '../../styles/theme';
import {favoritesStyles as styles} from '../../styles/favoritesStyles';
import {http} from '../../lib/http';
import { getCurrentUser } from '../../lib/authSession';

// 타입
type FavType = '커피' | '티' | '그 외';

export type FavItem = {
  id: string;
  type: FavType;

  // 표시용
  name: string;        // 예: 아이스 아메리카노
  brand: string;       // 예: 스타벅스
  volumeText?: string; // 예: Tall / 355ml

  // 백엔드 저장용
  beverageId: number;  // 어떤 음료인지 식별 
  volumeMl: number;
  caffeineMg: number;
};

const CATEGORIES = ['전체', '커피', '티', '그 외'] as const;
type Category = (typeof CATEGORIES)[number];

const Chip = memo(function Chip({
  label,
  active,
  onPress,
}: {
  label: Category;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.chip,
        active ? styles.chipActive : styles.chipInactive,
      ]}>
      <Text
        style={[
          styles.chipText,
          active ? styles.chipTextActive : styles.chipTextInactive,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
});

const FavoriteRow = memo(function FavoriteRow({
  item,
  onSelect,
}: {
  item: FavItem;
  onSelect: (v: FavItem) => void;
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

      {/* 표시 텍스트는 mg 단위로 통일 */}
      <Text style={styles.caffeine}>{item.caffeineMg} mg</Text>
    </TouchableOpacity>
  );
});

/**
 * DEMO 데이터
 *  - beverageId, volumeMl, caffeineMg 값은 실제 DB에 맞게 나중에 수정 필요 (추측입니다)
 */
const DEMO_DATA: FavItem[] = [
  {
    id: '1',
    type: '커피',
    name: '아이스 아메리카노',
    brand: '스타벅스',
    volumeText: 'Tall / 355ml',
    beverageId: 1,   // TODO: 실제 beverage 테이블의 id로 교체
    volumeMl: 355,
    caffeineMg: 141,
  },
];

export default function FavoritesScreen() {
  const nav = useNavigation(); // 구조 확정 후 타입 지정 가능

  const [category, setCategory] = useState<Category>('전체');

  const list = useMemo(() => {
    if (category === '전체') {
      return DEMO_DATA;
    }
    return DEMO_DATA.filter(d => d.type === category);
  }, [category]);

  const handleSelect = useCallback(
    async (item: FavItem) => {
      try {
        const user = getCurrentUser();
        if (!user) {
          Alert.alert('로그인 필요', '다시 로그인 후 이용해 주세요.');
          return;
        }
  
        await http.post('/api/intakes', {
          userId: user.id,
          beverageId: item.beverageId,
          volumeMl: item.volumeMl,
          caffeineMg: item.caffeineMg,
          note: `${item.brand} ${item.name}`,
          consumedAt: null,
        });

        if (Platform.OS === 'android') {
          ToastAndroid.show('섭취 기록을 등록했습니다.', ToastAndroid.SHORT);
        }

        nav.navigate('Tabs' as never, {screen: 'Home'} as never);
      } catch (e: unknown) {
          if (e instanceof Error) {
            console.log('manual add error', e.message);
          } else {
            console.log('unknown error', e);
          }
        Alert.alert('오류', '기록 저장 중 문제가 발생했습니다.');
      }
      
    },
    [nav],
  );

  return (
    <SafeAreaView style={common.screen}>
      <AppHeader title="즐겨찾기 등록" />

      <View style={[common.container, {paddingTop: theme.spacing(2)}]}>
        {/* 카테고리 칩 */}
        <View style={styles.chipRow}>
          {CATEGORIES.map(c => (
            <Chip
              key={c}
              label={c}
              active={c === category}
              onPress={() => setCategory(c)}
            />
          ))}
        </View>

        {/* 리스트 */}
        <FlatList
          data={list}
          keyExtractor={it => it.id}
          renderItem={({item}) => (
            <FavoriteRow item={item} onSelect={handleSelect} />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{paddingBottom: theme.spacing(4)}}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
