import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppHeader from '../../components/AppHeader';
import { statisticsStyles } from '../../styles/statisticsStyles';
import { theme } from '../../styles/theme';
import type { Drink } from './mockData';
import type { RootStackParamList } from '../../navigation/types';
import {
  addFavorite,
  fetchFavorites,
  deleteFavorite,
} from '../../api/favorites';
import { getCurrentUser } from '../../lib/authSession';

export default function StatisticsDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<{
    params: RootStackParamList['StatisticsDetail'];
  }>();
  const { monthLabel, items } = route.params || { monthLabel: '', items: [] };
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

  // 하트 버튼 토글 핸들러
  const handleFavoriteToggle = async (item: Drink) => {
    if (loading) return;
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        console.log(' [즐겨찾기] 사용자 정보 없음');
        return;
      }

      const key = `${item.brand}|${item.name}`;
      const existing = favoriteMap.get(key);

      if (existing) {
        console.log(' [즐겨찾기] 삭제 시도:', existing.id);
        await deleteFavorite(existing.id);
        setFavoriteMap(prev => {
          const next = new Map(prev);
          next.delete(key);
          console.log(
            '[즐겨찾기] 삭제 완료, 새로운 맵:',
            Array.from(next.keys()),
          );
          return next;
        });
      } else {
        console.log(' [즐겨찾기] 추가 시도:', {
          brand: item.brand,
          name: item.name,
        });
        const favoriteId = await addFavorite({
          userId: user.id,
          beverageId: null,
          brand: item.brand,
          name: item.name,
          caffeineMg: 0,
          volumeMl: 0,
        });
        console.log('[즐겨찾기] 추가 완료, ID:', favoriteId);
        setFavoriteMap(prev => {
          const next = new Map(prev);
          next.set(key, { id: favoriteId, beverageId: null });
          console.log(
            '[즐겨찾기] 상태 업데이트 완료, 새로운 맵:',
            Array.from(next.keys()),
          );
          return next;
        });
      }
    } catch (e) {
      console.error(' [즐겨찾기] 토글 실패:', e);
      if (e instanceof Error) {
        console.error('에러 메시지:', e.message);
        console.error('에러 스택:', e.stack);
      }
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (item: Drink) => {
    const key = `${item.brand}|${item.name}`;
    const result = favoriteMap.has(key);
    console.log(' [즐겨찾기] 체크:', {
      key,
      result,
      mapSize: favoriteMap.size,
    });
    return result;
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      edges={['top']}
    >
      <AppHeader
        title="최근 마신 음료"
        onBack={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={statisticsStyles.container}
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <View style={statisticsStyles.section}>
          <FlatList
            data={items}
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
                <View
                  style={statisticsStyles.drinkMeta}
                  pointerEvents="box-none"
                >
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
      </ScrollView>
    </SafeAreaView>
  );
}
