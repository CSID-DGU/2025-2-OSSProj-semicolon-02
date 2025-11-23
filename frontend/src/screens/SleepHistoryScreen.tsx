// src/screens/SleepHistoryScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AppHeader from '../components/AppHeader';
import { homeStyles } from '../styles/homeStyles';
import { common } from '../styles/common';
import { theme } from '../styles/theme';

type SleepLog = {
  date: string;       // YYYY-MM-DD
  sleepAt: string;    // 'HH:MM'
  wakeAt: string;     // 'HH:MM'
  caffeineMg: number; // 해당 날짜 섭취 카페인
};

const initialLogs: SleepLog[] = [
  { date: '2025-11-23', sleepAt: '01:30', wakeAt: '08:00', caffeineMg: 220 },
  { date: '2025-11-22', sleepAt: '02:10', wakeAt: '07:40', caffeineMg: 150 },
  { date: '2025-11-21', sleepAt: '00:50', wakeAt: '07:20', caffeineMg: 310 },
];

function getDurationMinutes(log: SleepLog): number {
  const [sh, sm] = log.sleepAt.split(':').map(Number);
  const [wh, wm] = log.wakeAt.split(':').map(Number);
  const start = sh * 60 + sm;
  let end = wh * 60 + wm;
  if (end <= start) end += 24 * 60;
  return end - start;
}

function formatDurationLabel(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}시간` : `${h}시간 ${m}분`;
}

export default function SleepHistoryScreen() {
  const [logs, setLogs] = useState<SleepLog[]>(initialLogs);

  const [editing, setEditing] = useState<SleepLog | null>(null);
  const [tmpSleepAt, setTmpSleepAt] = useState('');
  const [tmpWakeAt, setTmpWakeAt] = useState('');
  const [tmpCaffeine, setTmpCaffeine] = useState('');

  const avgDuration = useMemo(() => {
    if (logs.length === 0) return '-';
    const total = logs.reduce((sum, l) => sum + getDurationMinutes(l), 0);
    const avg = Math.round(total / logs.length);
    return formatDurationLabel(avg);
  }, [logs]);

  const maxDuration = useMemo(() => {
    if (logs.length === 0) return 1;
    return logs.reduce(
      (max, l) => Math.max(max, getDurationMinutes(l)),
      1,
    );
  }, [logs]);

  const handleEditLog = (log: SleepLog) => {
    setEditing(log);
    setTmpSleepAt(log.sleepAt);
    setTmpWakeAt(log.wakeAt);
    setTmpCaffeine(String(log.caffeineMg));
  };
  const handleCloseEdit = () => {
    setEditing(null);
  };
  const handleSaveEdit = () => {
    if (!editing) return;

    const updated: SleepLog = {
      ...editing,
      sleepAt: tmpSleepAt.trim(),
      wakeAt: tmpWakeAt.trim(),
      caffeineMg: Number(tmpCaffeine) || 0,
    };

    setLogs(prev =>
      prev.map(l => (l.date === editing.date ? updated : l)),
    );
    setEditing(null);
  };

  return (
    <SafeAreaView style={homeStyles.screenBG}>
      <AppHeader title="수면 기록" />

      <ScrollView contentContainerStyle={{ paddingBottom: theme.spacing(6) }}>
        {/* 상단 요약 카드 */}
        <View style={[common.section, { marginTop: theme.spacing(3) }]}>
          <View style={homeStyles.chartCard}>
            <Text style={common.subtle}>최근 1주일 평균 수면 시간</Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '800',
                marginTop: theme.spacing(1),
              }}
            >
              {avgDuration}
            </Text>
            <Text
              style={[common.subtle, { marginTop: theme.spacing(1) }]}
            >
              취침·기상 시각과 카페인 섭취량을 함께 확인해 보세요.
            </Text>
          </View>
        </View>

        {/* 일자별 기록 리스트 */}
        <View style={common.section}>
          <Text style={homeStyles.sectionTitle}>
            최근 수면 + 카페인 기록
          </Text>

          {logs.map(log => {
            const durMin = getDurationMinutes(log);
            const ratio = Math.min(1, durMin / maxDuration); // 0~1

            return (
              <View key={log.date} style={homeStyles.sleepHistoryCard}>
                {/* 날짜 + 수정 버튼 */}
                <View style={homeStyles.sleepHistoryHeader}>
                  <Text style={common.subtle}>{log.date}</Text>
                  <TouchableOpacity onPress={() => handleEditLog(log)}>
                    <Ionicons
                      name="create-outline"
                      size={16}
                      color={theme.colors.gray600}
                    />
                  </TouchableOpacity>
                </View>

                {/* 그래프 느낌 바 + 텍스트 */}
                <View style={homeStyles.sleepHistoryRow}>
                  <View style={homeStyles.sleepHistoryLeft}>
                    <View style={homeStyles.sleepBarTrack}>
                      <View
                        style={[
                          homeStyles.sleepBarFill,
                          { width: `${ratio * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={homeStyles.sleepHistoryDuration}>
                      {formatDurationLabel(durMin)}
                    </Text>
                  </View>

                  <View style={homeStyles.sleepHistoryRight}>
                    <Text style={homeStyles.sleepHistoryMeta}>
                      취침 {log.sleepAt} · 기상 {log.wakeAt}
                    </Text>
                    <Text style={homeStyles.sleepHistoryMeta}>
                      카페인 {log.caffeineMg}mg
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* 편집 모달  */}
      {editing && (
        <View style={homeStyles.sleepEditOverlay}>
          <View style={homeStyles.sleepEditCard}>
            <Text style={homeStyles.sleepEditTitle}>
              {editing.date} 수면 기록 수정
            </Text>

            <View style={homeStyles.sleepEditRow}>
              <Text style={homeStyles.sleepLabel}>어제 취침</Text>
              <TextInput
                style={homeStyles.sleepInput}
                value={tmpSleepAt}
                onChangeText={setTmpSleepAt}
                placeholder="HH:MM"
              />
            </View>

            <View style={homeStyles.sleepEditRow}>
              <Text style={homeStyles.sleepLabel}>오늘 기상</Text>
              <TextInput
                style={homeStyles.sleepInput}
                value={tmpWakeAt}
                onChangeText={setTmpWakeAt}
                placeholder="HH:MM"
              />
            </View>

            <View style={homeStyles.sleepEditRow}>
              <Text style={homeStyles.sleepLabel}>카페인 섭취량</Text>
              <TextInput
                style={homeStyles.sleepInput}
                value={tmpCaffeine}
                onChangeText={setTmpCaffeine}
                keyboardType="numeric"
                placeholder="mg"
              />
            </View>

            <View style={homeStyles.sleepEditActions}>
              <TouchableOpacity
                style={homeStyles.sleepCancelBtn}
                onPress={handleCloseEdit}
              >
                <Text style={homeStyles.sleepCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={homeStyles.sleepSaveBtn}
                onPress={handleSaveEdit}
              >
                <Text style={homeStyles.sleepSaveText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
