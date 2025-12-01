// screens/Add/Favorites.tsx
import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import { common } from '../../styles/common';
import { theme } from '../../styles/theme';
import { favoritesStyles as styles } from '../../styles/favoritesStyles';
import { http } from '../../lib/http';
import { getCurrentUser } from '../../lib/authSession';
import { fetchFavorites } from '../../api/favorites';
//섭취량 연동
import { createIntake } from '../../api/intakes';

// 타입
type FavType = '커피' | '티' | '그 외';

export type FavItem = {
  id: string;
  type: FavType;

  // 표시용
  name: string; // 예: 아이스 아메리카노
  brand: string; // 예: 스타벅스
  volumeText?: string; // 예: Tall / 355ml

  // 백엔드 저장용(지금은 manual API만 사용하므로 beverageId는 실제로 쓰지 않음)
  beverageId: number;
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
      style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
    >
      <Text
        style={[
          styles.chipText,
          active ? styles.chipTextActive : styles.chipTextInactive,
        ]}
      >
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
      style={styles.rowCard}
    >
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

export default function FavoritesScreen() {
  const nav = useNavigation(); // 구조 확정 후 타입 지정 가능

  const [category, setCategory] = useState<Category>('전체');
  const [favorites, setFavorites] = useState<FavItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 즐겨찾기 목록 로드
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const data = await fetchFavorites(user.id);
        const mapped: FavItem[] = data.map(f => ({
          id: String(f.id),
          type: '커피' as FavType, // 실제로는 beverage 정보에서 가져와야 함
          name: f.name,
          brand: f.brand,
          volumeText: f.volumeMl > 0 ? `${f.volumeMl}ml` : undefined,
          beverageId: f.beverageId || 0,
          volumeMl: f.volumeMl,
          caffeineMg: f.caffeineMg,
        }));
        setFavorites(mapped);
      } catch (e) {
        console.error('Failed to load favorites', e);
        Alert.alert('오류', '즐겨찾기 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, []);

  const list = useMemo(() => {
    const filtered =
      category === '전체'
        ? favorites
        : favorites.filter(d => d.type === category);
    return filtered;
  }, [category, favorites]);

  const handleSelect = useCallback(
    async (item: FavItem) => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          Alert.alert('로그인 필요', '다시 로그인 후 이용해 주세요.');
          nav.navigate('Login' as never);
          return;
        }

        // ★ 즐겨찾기도 수동 등록 API를 사용 (Beverage 미리 없어도 됨)
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

        nav.navigate('Tabs' as never, { screen: 'Home' } as never);
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.log('favorites add error', e.message);
        } else {
          console.log('favorites unknown error', e);
        }
        Alert.alert('오류', '기록 저장 중 문제가 발생했습니다.');
      }
    },
    [nav],
  );

  return (
    <SafeAreaView style={common.screen}>
      <AppHeader title="즐겨찾기 등록" />

      <View style={[common.container, { paddingTop: theme.spacing(2) }]}>
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
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 100,
            }}
          >
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 16, color: theme.colors.gray500 }}>
              즐겨찾기를 불러오는 중...
            </Text>
          </View>
        ) : list.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 100,
            }}
          >
            <Text style={{ color: theme.colors.gray500 }}>
              즐겨찾기가 없습니다.
            </Text>
            <Text
              style={{
                color: theme.colors.gray500,
                marginTop: 8,
                fontSize: 12,
              }}
            >
              통계 화면에서 하트 버튼을 눌러 즐겨찾기를 추가하세요.
            </Text>
          </View>
        ) : (
          <FlatList
            data={list}
            keyExtractor={it => it.id}
            renderItem={({ item }) => (
              <FavoriteRow item={item} onSelect={handleSelect} />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={{ paddingBottom: theme.spacing(4) }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
