import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, Pressable, StyleSheet } from 'react-native';
import { goalStyles } from '../../../styles/goalStyles';
import { theme } from '../../../styles/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSaved: (v: { daily: number; monthly: number }) => void; 
};

type Mode = 'daily' | 'monthly';
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const presetsDaily = [200, 300, 400];
const presetsMonthly = [6000, 9000, 12000];

/** 상단 일간/월간 토글 */
function Segmented({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <View style={[goalStyles.segmentedWrap, { alignSelf: 'stretch' }]}>
      <TouchableOpacity
        style={[goalStyles.segmentBtn, mode === 'daily' && goalStyles.segmentBtnActive, { flex: 1, alignItems: 'center' }]}
        onPress={() => onChange('daily')}
        activeOpacity={0.8}
      >
        <Text style={[goalStyles.segmentText, mode === 'daily' && goalStyles.segmentTextActive]}>일간</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[goalStyles.segmentBtn, mode === 'monthly' && goalStyles.segmentBtnActive, { flex: 1, alignItems: 'center' }]}
        onPress={() => onChange('monthly')}
        activeOpacity={0.8}
      >
        <Text style={[goalStyles.segmentText, mode === 'monthly' && goalStyles.segmentTextActive]}>월간</Text>
      </TouchableOpacity>
    </View>
  );
}

/** 수치 입력 + 증감 버튼 */
function NumberRow({
  label, value, unit, step = 50, min = 50, max = 20000, onChange,
}: {
  label: string; value: number; unit: string; step?: number; min?: number; max?: number; onChange: (n: number) => void;
}) {
  return (
    <View style={[goalStyles.numberRow, { marginTop: theme.spacing(1) }]}>
      <Text style={goalStyles.numberLabel}>{label}</Text>
      <View style={goalStyles.numberRight}>
        <TouchableOpacity style={goalStyles.stepBtn} onPress={() => onChange(clamp(value - step, min, max))} activeOpacity={0.8}>
          <Text style={goalStyles.stepBtnTxt}>－</Text>
        </TouchableOpacity>
        <TextInput
          value={String(value)}
          onChangeText={(t) => {
            const n = Number(t.replace(/\D/g, ''));
            if (!Number.isNaN(n)) onChange(clamp(n, min, max));
          }}
          keyboardType="number-pad"
          style={goalStyles.numberInput}
        />
        <Text style={goalStyles.unit}>{unit}</Text>
        <TouchableOpacity style={goalStyles.stepBtn} onPress={() => onChange(clamp(value + step, min, max))} activeOpacity={0.8}>
          <Text style={goalStyles.stepBtnTxt}>＋</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/** 프리셋 버튼 묶음 */
function Presets({ items, onPick }: { items: number[]; onPick: (v: number) => void }) {
  return (
    <View style={[goalStyles.presetWrap, { marginTop: 10 }]}>
      {items.map((v) => (
        <TouchableOpacity key={v} style={goalStyles.presetBtn} onPress={() => onPick(v)} activeOpacity={0.85}>
          <Text style={goalStyles.presetTxt}>{v}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function GoalTargetModal({ visible, onClose, onSaved }: Props) {
  const [mode, setMode] = useState<Mode>('daily');
  const [dailyTarget, setDailyTarget] = useState(400);
  const [monthlyTarget, setMonthlyTarget] = useState(12000);

  // TODO: 실제 값 연동
  const currentDaily = 180;
  const currentMonthly = 5400;

  const percent = useMemo(
    () =>
      mode === 'daily'
        ? (currentDaily / Math.max(dailyTarget, 1)) * 100
        : (currentMonthly / Math.max(monthlyTarget, 1)) * 100,
    [mode, dailyTarget, monthlyTarget]
  );

  const usePreset = (v: number) => (mode === 'daily' ? setDailyTarget(v) : setMonthlyTarget(v));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* 어두운 배경 */}
      <Pressable style={modalStyles.backdrop} onPress={onClose} />

      {/* 본문 카드 */}
      <View style={modalStyles.card}>
        <Text style={modalStyles.title}>목표 설정</Text>

        <Segmented mode={mode} onChange={setMode} />

        <View style={[goalStyles.card, { marginTop: 12 }]}>
          {mode === 'daily' ? (
            <>
              <NumberRow label="일간 목표" value={dailyTarget} unit="mg" onChange={setDailyTarget} />
              <Presets items={presetsDaily} onPick={usePreset} />
            </>
          ) : (
            <>
              <NumberRow label="월간 목표" value={monthlyTarget} unit="mg" step={100} onChange={setMonthlyTarget} />
              <Presets items={presetsMonthly} onPick={usePreset} />
            </>
          )}
        </View>

        <Text style={[goalStyles.previewTitle, { marginTop: 12, textAlign: 'center' }]}>
          {mode === 'daily'
            ? `오늘 ${currentDaily} / ${dailyTarget} mg`
            : `이번 달 ${currentMonthly} / ${monthlyTarget} mg`}  ·  {Math.round(percent)}%
        </Text>

        <View style={modalStyles.btnRow}>
          <TouchableOpacity style={modalStyles.btnGhost} onPress={onClose} activeOpacity={0.85}>
            <Text style={modalStyles.btnGhostTxt}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={modalStyles.btnPrimary}
            onPress={() => onSaved({ daily: dailyTarget, monthly: monthlyTarget })}
            activeOpacity={0.9}
          >
            <Text style={modalStyles.btnPrimaryTxt}>저장</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  backdrop: {
    position: 'absolute', left: 0, top: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  card: {
    position: 'absolute', left: 16, right: 16, top: 80,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1, borderColor: theme.colors.line,
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginBottom: 8 },

  btnRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16 },
  btnGhost: {
    height: 44, paddingHorizontal: 16, borderRadius: 10,
    borderWidth: 1, borderColor: theme.colors.line, alignItems: 'center', justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  btnGhostTxt: { color: theme.colors.gray700, fontWeight: '700' },
  btnPrimary: {
    height: 44, paddingHorizontal: 18, borderRadius: 10,
    backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  btnPrimaryTxt: { color: theme.colors.white, fontWeight: '800' },
});
