import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {theme} from '../styles/theme';
import {cafeListItemStyles} from '../styles/cafeListItemStyles';

interface Cafe {
  id: string;
  name: string;
  status: string;
  image?: string;
}

interface CafeListItemProps {
  cafe: Cafe;
}

export default function CafeListItem({cafe}: CafeListItemProps) {
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <View style={cafeListItemStyles.container}>
      {/* 아바타 */}
      <View style={cafeListItemStyles.avatar}>
        <Ionicons name="cafe" size={24} color={theme.colors.primary} />
      </View>

      {/* 카페 정보 */}
      <View style={cafeListItemStyles.info}>
        <Text style={cafeListItemStyles.name}>{cafe.name}</Text>
        <Text style={cafeListItemStyles.status}>{cafe.status}</Text>
      </View>

      {/* 하트 아이콘 */}
      <TouchableOpacity
        onPress={() => setIsFavorite(!isFavorite)}
        style={cafeListItemStyles.favoriteButton}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={20}
          color={isFavorite ? '#FF715B' : theme.colors.gray500}
        />
      </TouchableOpacity>
    </View>
  );
}

