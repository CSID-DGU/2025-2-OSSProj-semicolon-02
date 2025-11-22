import React, {memo, useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {common} from '../../styles/common';
import {theme} from '../../styles/theme';
//섭취량 연동
import { createIntake } from '../../api/intakes'; 

export type Theme = typeof theme;

type FavType = '커피' | '티' | '그 외';
type FavItem = {
  id: string;
  type: FavType;
  name: string;      // 예: 고고단 다이어트 단백질 쉐이크 (…)
  brand: string;     // 예: 바른닭
  volumeText?: string; // 예: 40g
 caffein: string;      // 예: 141g
};

const CATEGORIES = ['전체', '커피', '티', '그 외'] as const;
type Category = typeof CATEGORIES[number];

// ── Chip ────────────────────────────────────────────────────────────────────────
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
      activeOpacity={0.85}
      style={[
        styles.chip,
        active ? styles.chipActive : styles.chipInactive,
      ]}>
      <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
});

// ── Favorite Row ───────────────────────────────────────────────────────────────
const FavoriteRow = memo(function FavoriteRow({
  item,
  onAdd,
}: {
  item: FavItem;
  onAdd: (v: FavItem) => void;
}) {
  return (
    <View style={styles.row}>
      {/* 좌측 점 */}
      <View style={styles.bullet} />
      {/* 가운데 텍스트 */}
      <View style={styles.rowTextWrap}>
        <Text numberOfLines={1} style={styles.rowTitle}>
          {item.name}
        </Text>
        <Text numberOfLines={1} style={styles.rowSub}>
          {item.brand}{item.volumeText ? ` ${item.volumeText}` : ''}
        </Text>
      </View>
      {/* caffein */}
      <Text style={styles.caffein}>{item.caffein}</Text>
      {/* + 버튼 */}
      <TouchableOpacity
        onPress={() => onAdd(item)}
        hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
        style={styles.plusBtn}
        activeOpacity={0.9}>
        <Ionicons name="add" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
});

// ── Screen ─────────────────────────────────────────────────────────────────────
export default function FavoritesScreen() {
  const [category, setCategory] = useState<Category>('전체');

  // 데모 데이터 (백엔드 붙이면 교체)
  const data: FavItem[] = [
    {
      id: '1',
      type: '커피',
      name: '아이스 아메리카노',
      brand: '스타벅스',
      volumeText: '',
      caffein: '카페인 141g',
    },
    // 더미 아이템 추가 가능
  ];

  const list = useMemo(() => {
    if (category === '전체') return data;
    return data.filter(d => d.type === category);
  }, [category, data]);
/* 
  const onAdd = useCallback((item: FavItem) => {
    // TODO: 선택 목록에 담거나 이전 화면으로 전달
    Alert.alert('추가됨', `${item.name} 항목을 담았어요.`);
  }, []); */
  const onAdd = useCallback(async (item: FavItem) => {  // async 추가
    try {
      // TODO: userId와 beverageId는 실제로는 로그인한 사용자 ID와 Beverage 테이블에서 조회해야 함
      const userId = 1; // 임시 값
      const beverageId = 1; // 임시 값 (FavItem에서 매핑 필요)
      
      // caffein 문자열에서 숫자 추출 (예: "카페인 141g" -> 141)
      const caffeineMatch = item.caffein.match(/(\d+)/);
      const caffeineMg = caffeineMatch ? Number(caffeineMatch[1]) : 0;
      
      // volumeText에서 숫자 추출 (예: "40g" -> 40)
      const volumeMatch = item.volumeText?.match(/(\d+)/);
      const volumeMl = volumeMatch ? Number(volumeMatch[1]) : 0;
      
      await createIntake({
        userId,
        beverageId,
        volumeMl,
        caffeineMg,
        note: `${item.brand} ${item.name}`,
      });
      
      Alert.alert('추가됨', `${item.name} 섭취 기록이 저장되었습니다.`);
    } catch (error) {
      Alert.alert('오류', '저장에 실패했습니다.');
      console.error('Intake 생성 오류:', error);
    }
  }, []);

  const onDone = useCallback(() => {
    // TODO: 선택값 전달 후 뒤로가기
    // navigation.goBack();
    Alert.alert('완료', '선택 항목을 적용합니다.');
  }, []);

  return (
    <SafeAreaView style={[common.screen, {backgroundColor: theme.colors.gray100}]}>
      {/* 상단 화이트 패널 */}
      <View style={styles.panel}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={() => { /* navigation.goBack?.(); */ }}>
            <Ionicons name="chevron-back" size={22} color={theme.colors.gray900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>즐겨찾기</Text>
          <View style={{width: 32}} />
        </View>

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
          keyExtractor={(it) => it.id}
          renderItem={({item}) => <FavoriteRow item={item} onAdd={onAdd} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 120}}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* 하단 고정 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.9} onPress={onDone} style={styles.doneBtn}>
          <Text style={styles.doneText}>완료</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const RADIUS = 28;

const styles = {
  panel: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: RADIUS,
    overflow: 'hidden' as const,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn: {
    width: 32, height: 32, alignItems: 'center' as const, justifyContent: 'center' as const,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'left' as const,
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.colors.gray900,
  },

  chipRow: {
    flexDirection: 'row' as const,
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipInactive: {
    backgroundColor: '#fff',
    borderColor: theme.colors.gray300,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  chipTextActive: {color: '#fff'},
  chipTextInactive: {color: theme.colors.gray700},

  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 14,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.gray300,
    marginRight: 10,
  },
  rowTextWrap: {flex: 1},
  rowTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: theme.colors.gray900,
  },
  rowSub: {
    marginTop: 2,
    fontSize: 12,
    color: theme.colors.gray500,
  },
  caffein: {
    marginRight: 10,
    fontSize: 13,
    color: theme.colors.gray600,
  },
  plusBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: theme.colors.primary,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.gray100,
  },

  footer: {
    position: 'absolute' as const,
    left: 0, right: 0, bottom: 0,
    padding: 16,
  },
  doneBtn: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#DEBE8A', // 캡처의 베이지 톤
    marginHorizontal: 16,
  },
  doneText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800' as const,
  },
};