import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {theme} from '../styles/theme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: () => void; // ← 추가
}

export default function AppHeader({title, subtitle, right, onBack}: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{top:10,bottom:10,left:10,right:10}}>
            {/* 아이콘 없을 때를 대비해 텍스트 화살표 사용 */}
            <Text style={styles.backTxt}>←</Text>
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {right && <View>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing(3),      // 좌우 여백 
    paddingTop: theme.spacing(5),             // 상단 패딩 
    paddingBottom: theme.spacing(3),          // 하단 패딩 
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.line,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  backBtn: {
    marginRight: 6,
    paddingRight: 6,
    paddingBottom: 2,
  },
  backTxt: {
    fontSize: 26,                // 화살표 크기 
    color: theme.colors.text,
  },
  title: {
    fontSize: 28,                // 제목 크기 
    fontWeight: '800',
    color: theme.colors.text,
    lineHeight: 34,              // 글씨 간격 보정
  },
  subtitle: {
    fontSize: 14,                // 부제
    color: theme.colors.gray500,
    marginTop: 6,
  },
});