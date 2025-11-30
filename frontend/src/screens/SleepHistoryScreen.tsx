import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AppHeader from '../components/AppHeader';
import { homeStyles } from '../styles/homeStyles';
import { common } from '../styles/common';
import { theme } from '../styles/theme';

import { getCurrentUser } from '../lib/authSession';
import { fetchSleepHistory, updateSleepLog, SleepLogApi } from '../api/sleep';

type SleepLog = {
  id: number;
  date: string; // YYYY-MM-DD
  sleepAt: string; // HH:MM
  wakeAt: string; // HH:MM
  caffeineMg: number; /// todo: 추후 합칠 예정
};


function getDurationMinutes(log: SleepLog): number {
  const [sh, sm] = log.sleepAt.split(':').map(Number);
  const [wh, wm] = log.wakeAt.split(':').map(Number);
  const start = sh * 60 + sm;
  let end = wh * 60 + wm;
  if (end <= start) end += 24 * 60;
  return end - start;
}

function formatDurationLabel(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}시간` : `${h}시간 ${m}분`;
}

function buildIso(date: string, sleep: string, wake: string) {
  const [y, m, d] = date.split('-').map(Number);
  const [sh, sm] = sleep.split(':').map(Number);
  const [wh, wm] = wake.split(':').map(Number);

  const sleepDt = new Date(y, m - 1, d, sh, sm);

  let wakeDt = new Date(y, m - 1, d, wh, wm);
  if (wakeDt.getTime() <= sleepDt.getTime()) {
    wakeDt = new Date(y, m - 1, d + 1, wh, wm);
  }

  const toIso = (dt: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
      `${dt.getFullYear()}-` +
      `${pad(dt.getMonth() + 1)}-` +
      `${pad(dt.getDate())}T` +
      `${pad(dt.getHours())}:${pad(dt.getMinutes())}:00`
    );
  };

  return {
    sleepAt: toIso(sleepDt),
    wakeAt: toIso(wakeDt),
  };
}

export default function SleepHistoryScreen() {
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [editing, setEditing] = useState<SleepLog | null>(null);
  const [tmpSleep, setTmpSleep] = useState('');
  const [tmpWake, setTmpWake] = useState('');
  const [tmpCaffeine, setTmpCaffeine] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setErr(null);

      const user = await getCurrentUser();
      if (!user) {
        setErr('사용자 정보를 찾을 수 없습니다.');
        return;
      }

      const raw: SleepLogApi[] = await fetchSleepHistory(user.id, 7);

      const mapped: SleepLog[] = raw.map((l) => ({
        id: l.id,
        date: l.sleepAt.slice(0, 10),
        sleepAt: l.sleepAt.slice(11, 16),
        wakeAt: l.wakeAt.slice(11, 16),
        caffeineMg: 0,
      }));

      setLogs(mapped);
    } catch (e) {
      setErr('수면 기록 불러오기 실패');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const avg = useMemo(() => {
    if (logs.length === 0) return '-';
    const total = logs.reduce((s, l) => s + getDurationMinutes(l), 0);
    return formatDurationLabel(Math.round(total / logs.length));
  }, [logs]);

  const max = useMemo(() => {
    if (logs.length === 0) return 1;
    return logs.reduce((m, l) => Math.max(m, getDurationMinutes(l)), 1);
  }, [logs]);

  const openEdit = (log: SleepLog) => {
    setEditing(log);
    setTmpSleep(log.sleepAt);
    setTmpWake(log.wakeAt);
    setTmpCaffeine(String(log.caffeineMg));
  };

  const save = async () => {
    if (!editing) return;

    try {
      setLoading(true);
      setErr(null);

      const { sleepAt, wakeAt } = buildIso(
        editing.date,
        tmpSleep.trim(),
        tmpWake.trim(),
      );

      await updateSleepLog(editing.id, { sleepAt, wakeAt });
      await load();

      setEditing(null);
    } catch (e) {
      setErr('수정 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={homeStyles.screenBG}>
      <AppHeader title="수면 기록" />

      {loading && (
        <View style={{ padding: 12 }}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      )}

      {err && (
        <View style={{ padding: 12 }}>
          <Text style={{ color: 'red' }}>{err}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={[common.section, { marginTop: 20 }]}>
          <View style={homeStyles.sleepAvgCard}>
            <Text style={common.subtle}>최근 1주일 평균 수면 시간</Text>
            <Text style={{ fontSize: 24, fontWeight: '800', marginTop: 8 }}>
              {avg}
            </Text>
          </View>
        </View>

        <View style={common.section}>
          <View
            style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}>
          <Text style={homeStyles.sectionTitle}>최근 수면 기록</Text>
          <TouchableOpacity
            onPress={load}
            style={{ marginLeft: 6, padding: 4 }}>
            <Ionicons
              name="refresh"
              size={16}
              color={theme.colors.gray600}
            />
          </TouchableOpacity>
        </View>

          {logs.map((log) => {
            const mins = getDurationMinutes(log);
            const ratio = Math.min(1, mins / max);

            return (
              <View key={log.id} style={homeStyles.sleepHistoryCard}>
                <View style={homeStyles.sleepHistoryHeader}>
                  <Text style={common.subtle}>{log.date}</Text>
                  <TouchableOpacity onPress={() => openEdit(log)}>
                    <Ionicons
                      name="create-outline"
                      size={16}
                      color={theme.colors.gray600}
                    />
                  </TouchableOpacity>
                </View>

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
                      {formatDurationLabel(mins)}
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

      {editing && (
        <View style={homeStyles.sleepEditOverlay}>
          <View style={homeStyles.sleepEditCard}>
            <Text style={homeStyles.sleepEditTitle}>
              {editing.date} 기록 수정
            </Text>

            <View style={homeStyles.sleepEditRow}>
              <Text style={homeStyles.sleepLabel}>어제 취침</Text>
              <TextInput
                style={homeStyles.sleepInput}
                value={tmpSleep}
                onChangeText={setTmpSleep}
              />
            </View>

            <View style={homeStyles.sleepEditRow}>
              <Text style={homeStyles.sleepLabel}>오늘 기상</Text>
              <TextInput
                style={homeStyles.sleepInput}
                value={tmpWake}
                onChangeText={setTmpWake}
              />
            </View>

            <View style={homeStyles.sleepEditActions}>
              <TouchableOpacity
                style={homeStyles.sleepCancelBtn}
                onPress={() => setEditing(null)}
              >
                <Text style={homeStyles.sleepCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={homeStyles.sleepSaveBtn}
                onPress={save}
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
