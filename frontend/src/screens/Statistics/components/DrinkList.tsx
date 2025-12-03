import React, { useMemo, useState, useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { statisticsStyles } from '../../../styles/statisticsStyles';
import { theme } from '../../../styles/theme';
import type { Drink } from '../mockData';
import type { RootStackParamList } from '../../../navigation/types';
import {
  addFavorite,
  fetchFavorites,
  deleteFavorite,
} from '../../../api/favorites';
import { getCurrentUser } from '../../../lib/authSession';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  title: string;
  items: Drink[];
  monthLabel: string;
};

export default function DrinkList({ title, items, monthLabel }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const [favoriteMap, setFavoriteMap] = useState<
    Map<string, { id: number; beverageId: number | null }>
  >(new Map());
  const [loading, setLoading] = useState(false);

  // 즐겨찾기 목록 로드
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) return;
        const favs = await fetchFavorites(user.id);
        const map = new Map<
          string,
          { id: number; beverageId: number | null }
        >();
        favs.forEach(f => {
          // brand + name을 키로 사용 (통계 화면의 Drink는 beverageId가 없을 수 있음)
          const key = `${f.brand}|${f.name}`;
          map.set(key, { id: f.id, beverageId: f.beverageId });
        });
        setFavoriteMap(map);
      } catch (e) {
        console.error('Failed to load favorites', e);
      }
    };
    loadFavorites();
  }, []);

  // 처음 2개만 표시
  const displayedItems = useMemo(() => {
    return items.slice(0, 2);
  }, [items]);

  // 2개이상이면 더보기 버튼 표시
  const hasMore = items.length > 2;

  // 하트 버튼 토글 핸들러
  const handleFavoriteToggle = async (item: Drink) => {
    if (loading) return;
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) return;

      const key = `${item.brand}|${item.name}`;
      const existing = favoriteMap.get(key);

      if (existing) {
        // 즐겨찾기 삭제
        await deleteFavorite(existing.id);
        setFavoriteMap(prev => {
          const next = new Map(prev);
          next.delete(key);
          return next;
        });
      } else {
        // 즐겨찾기 추가
        const favoriteId = await addFavorite({
          userId: user.id,
          beverageId: null, // 통계 화면에서는 beverageId를 모르므로 null
          brand: item.brand,
          name: item.name,
          caffeineMg: 0, // mockData에 없으므로 0
          volumeMl: 0,
        });
        setFavoriteMap(prev => {
          const next = new Map(prev);
          next.set(key, { id: favoriteId, beverageId: null });
          return next;
        });
      }
    } catch (e) {
      console.error('Failed to toggle favorite', e);
    } finally {
      setLoading(false);
    }
  };

  // 즐겨찾기 여부 확인
  const isFavorite = (item: Drink) => {
    const key = `${item.brand}|${item.name}`;
    return favoriteMap.has(key);
  };

  const handleMorePress = () => {
    navigation.navigate('StatisticsDetail', {
      monthLabel,
      items,
    });
  };

  return (
    <View>
      <View style={statisticsStyles.drinkListHeader}>
        <Text style={statisticsStyles.sectionTitle}>{title}</Text>
        {hasMore && (
          <TouchableOpacity activeOpacity={0.7} onPress={handleMorePress}>
            <Text style={[statisticsStyles.subtle, { fontWeight: '600' }]}>
              더보기
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={displayedItems}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        contentContainerStyle={statisticsStyles.drinkList}
        renderItem={({ item }) => (
          <View style={statisticsStyles.drinkCard} pointerEvents="box-none">
            <View style={statisticsStyles.drinkThumbnail}>
              <Text>☕️</Text>
            </View>
            <View>
              <Text style={statisticsStyles.drinkBrand}>{item.brand}</Text>
              <Text style={statisticsStyles.drinkName}>{item.name}</Text>
            </View>
            <View style={statisticsStyles.drinkMeta} pointerEvents="box-none">
              {item.count !== undefined ? (
                <Text style={statisticsStyles.price}>{item.count}회</Text>
              ) : item.price > 0 ? (
                <Text style={statisticsStyles.price}>
                  {item.price.toLocaleString()}원
                </Text>
              ) : null}
              <TouchableOpacity
                style={statisticsStyles.favoriteButton}
                activeOpacity={0.8}
                onPress={() => handleFavoriteToggle(item)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={isFavorite(item) ? 'heart' : 'heart-outline'}
                  size={16}
                  color={
                    isFavorite(item)
                      ? theme.colors.primary
                      : theme.colors.gray500
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
