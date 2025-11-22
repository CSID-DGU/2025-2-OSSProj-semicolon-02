import React, { useCallback, useState, memo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

//스크린
export default function ManualAdd() {
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [caffeine, setCaffeine] = useState('');
  const [volume, setVolume] = useState('');

  const onSave = useCallback(async () => {
    if (!name || !caffeine) {
      Alert.alert('입력 확인', '음료명과 카페인 함량은 필수입니다.');
      return;
    }
    // 숫자 형식 검증
    const caf = Number(caffeine);
    const vol = volume ? Number(volume) : 0;
    if (Number.isNaN(caf) || caf <= 0) {
      Alert.alert('형식 오류', '카페인 함량은 양의 숫자로 입력하세요.');
      return;
    }
    if (volume && (Number.isNaN(vol) || vol <= 0)) {
      Alert.alert('형식 오류', '용량은 양의 숫자로 입력하세요.');
      return;
    }
    try {
      // try-catch 추가
      // TODO: userId와 beverageId는 실제로는 로그인한 사용자 ID와 Beverage 테이블에서 조회해야 함
      const userId = 1; // 임시 값
      const beverageId = 1; // 임시 값

      await createIntake({
        // createIntake 호출
        userId,
        beverageId,
        volumeMl: vol,
        caffeineMg: caf,
        note: brand ? `${brand} ${name}` : name,
      });

      // TODO: 백엔드 연동
      Alert.alert('저장됨', '섭취 기록이 저장되었습니다.'); //성공
      // 화면 초기화
      setBrand('');
      setName('');
      setCaffeine('');
      setVolume('');
    } catch (error) {
      console.error('섭취 기록 저장 오류:', error); //실패
      Alert.alert(
        '저장 실패',
        '섭취 기록을 저장하는데 실패했습니다. 다시 시도해주세요.',
      );
    }
  }, [name, caffeine, volume, brand]);

  return (
    <View style={common.screen}>
      <ScrollView
        contentContainerStyle={[common.container, addStyles.scrollInner]}
      >
        <Text style={common.h1}>수동 등록</Text>

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
          activeOpacity={0.85}
        >
          <Ionicons name="save" size={18} color="#fff" />
          <Text style={addStyles.saveText}>저장</Text>
        </TouchableOpacity>

        <View style={addStyles.gap24} />
      </ScrollView>
    </View>
  );
}
