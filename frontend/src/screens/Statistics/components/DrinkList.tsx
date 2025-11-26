import React from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {statisticsStyles} from '../../../styles/statisticsStyles';
import {theme} from '../../../styles/theme';
import type {Drink} from '../mockData';

type Props = {
  title: string;
  items: Drink[];
};

export default function DrinkList({title, items}: Props) {
  return (
    <View>
      <View style={statisticsStyles.drinkListHeader}>
        <Text style={statisticsStyles.sectionTitle}>{title}</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={[statisticsStyles.subtle, {fontWeight: '600'}]}>
            더보기
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        contentContainerStyle={statisticsStyles.drinkList}
        renderItem={({item}) => (
          <View style={statisticsStyles.drinkCard}>
            <View style={statisticsStyles.drinkThumbnail}>
              <Text>☕️</Text>
            </View>
            <View>
              <Text style={statisticsStyles.drinkBrand}>{item.brand}</Text>
              <Text style={statisticsStyles.drinkName}>{item.name}</Text>
            </View>
            <View style={statisticsStyles.drinkMeta}>
              <Text style={statisticsStyles.price}>
                {item.price.toLocaleString()}원
              </Text>
              <TouchableOpacity
                style={statisticsStyles.favoriteButton}
                activeOpacity={0.8}>
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