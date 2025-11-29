import React from 'react';
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

export default function StatisticsDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<{
    params: RootStackParamList['StatisticsDetail'];
  }>();
  const { monthLabel, items } = route.params || { monthLabel: '', items: [] };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      edges={['top']}
    >
      <AppHeader
        title={`${monthLabel} 자주 마시는 음료`}
        onBack={() => navigation.goBack()}
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
                        item.favorite
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
