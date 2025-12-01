import React, { useMemo } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { statisticsStyles } from '../../../styles/statisticsStyles';
import { theme } from '../../../styles/theme';
import type { Drink } from '../mockData';
import type { RootStackParamList } from '../../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  title: string;
  items: Drink[];
  monthLabel: string;
};

export default function DrinkList({ title, items, monthLabel }: Props) {
  const navigation = useNavigation<NavigationProp>();

  // 처음 2개만 표시
  const displayedItems = useMemo(() => {
    return items.slice(0, 2);
  }, [items]);

  // 2개이상이면 더보기 버튼 표시
  const hasMore = items.length > 2;

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
          <View style={statisticsStyles.drinkCard}>
            <View style={statisticsStyles.drinkThumbnail}>
              <Text>☕️</Text>
            </View>
            <View>
              <Text style={statisticsStyles.drinkBrand}>{item.brand}</Text>
              <Text style={statisticsStyles.drinkName}>{item.name}</Text>
            </View>
            <View style={statisticsStyles.drinkMeta}>
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
              >
                <Ionicons
                  name={item.favorite ? 'heart' : 'heart-outline'}
                  size={16}
                  color={
                    item.favorite ? theme.colors.primary : theme.colors.gray500
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
