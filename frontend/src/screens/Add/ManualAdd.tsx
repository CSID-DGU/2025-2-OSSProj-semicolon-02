// screens/Add/ManualAdd.tsx
import React, {useCallback, useState, memo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {common} from '../../styles/common';
import {theme} from '../../styles/theme';
import {addStyles} from '../../styles/addStyles';
import AppHeader from '../../components/AppHeader';
import type {RootStackParamList} from '../../navigation/types';
import { http } from '../../lib/http';
import { getCurrentUser } from '../../lib/authSession';

// 필드
import { common } from '../../styles/common';
import { theme } from '../../styles/theme';
import { addStyles } from '../../styles/addStyles';
//섭취량 연동
import { createIntake } from '../../api/intakes';
//필드
type FieldProps = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
  required?: boolean;
};

const Field = memo(function Field({
  label,
  value,
  onChangeText,
  placeholder = '',
  keyboardType = 'default',
  required,
}: FieldProps) {
  return (
    <View style={addStyles.fieldWrap}>
      <Text style={addStyles.fieldLabel}>
        {label}
        {required ? '*' : ''}
        {label}
        {required ? '*' : ''}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        inputMode={keyboardType === 'numeric' ? 'numeric' : 'text'}
        style={addStyles.input}
        placeholderTextColor={theme.colors.gray500}
      />
    </View>
  );
});

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ManualAdd() {
  const nav = useNavigation<Nav>();

  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [caffeine, setCaffeine] = useState('');
  const [volume, setVolume] = useState('');

  const onSave = useCallback(async () => {
    if (!name || !caffeine) {
      Alert.alert('입력 확인', '음료명과 카페인 함량은 필수입니다.');
      return;
    }
  
    const caf = Number(caffeine);
    const vol = volume ? Number(volume) : undefined;
  
    if (Number.isNaN(caf) || caf <= 0) {
      Alert.alert('형식 오류', '카페인 함량은 양의 숫자로 입력하세요.');
      return;
    }
    if (volume && (Number.isNaN(vol) || vol <= 0)) {
      Alert.alert('형식 오류', '용량은 양의 숫자로 입력하세요.');
      return;
    }
  
    try {
      const user = await getCurrentUser();
      if (!user) {
        Alert.alert('로그인 필요', '다시 로그인 후 이용해 주세요.');
        return;
      }
  
      const noteText =
        brand.trim().length > 0
          ? `${brand.trim()} ${name.trim()}`
          : name.trim();
  
      await http.post('/api/intakes/manual', {
        userId: user.id,
        brand,
        name,
        caffeineMg: caf,
        volumeMl: vol,
        note: noteText,
        consumedAt: null,
      });
  
      Alert.alert('완료', '섭취 기록을 저장했습니다.', [
        { text: '확인', onPress: () => nav.goBack() },
      ]);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log('manual add error', e.message);
      } else {
        console.log('unknown error', e);
      }
      Alert.alert('오류', '기록 저장 중 문제가 발생했습니다.');
    }
  }, [brand, name, caffeine, volume, nav]);
  
  return (
    <SafeAreaView style={common.screen}>
      <AppHeader title="수동 등록"/>

      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={[common.container, addStyles.scrollInner]}>
        <Field
          label="브랜드"
          value={brand}
          onChangeText={setBrand}
          placeholder="예) 스타벅스"
        />
        <Field
          label="음료명"
          required
          value={name}
          onChangeText={setName}
          placeholder="예) 아메리카노"
        />
        <Field
          label="카페인 함량(mg)"
          required
          value={caffeine}
          onChangeText={setCaffeine}
          placeholder="예) 150"
          keyboardType="numeric"
        />
        <Field
          label="용량(ml)"
          value={volume}
          onChangeText={setVolume}
          placeholder="예) 355"
          keyboardType="numeric"
        />

        <View style={addStyles.gap20} />

        <TouchableOpacity
          onPress={onSave}
          style={addStyles.saveBtn}
          activeOpacity={0.85}>
          <Ionicons name="save" size={18} color="#fff" />
          <Text style={addStyles.saveText}>저장</Text>
        </TouchableOpacity>

        <View style={addStyles.gap24} />
      </ScrollView>
    </SafeAreaView>
  );
}
