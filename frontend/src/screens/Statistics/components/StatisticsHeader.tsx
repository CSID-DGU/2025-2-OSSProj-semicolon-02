import React, { useState, useRef, useEffect } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { statisticsStyles } from '../../../styles/statisticsStyles';
import { theme } from '../../../styles/theme';
import { getCurrentUser, type StoredUser } from '../../../lib/authSession';
import logoImg from '../../../../assets/img/logo.png';

type Props = {
  title: string;
  months: string[];
  selectedIndex: number;
  selectedLabel: string;
  onSelect: (index: number) => void;
};

export default function StatisticsHeader({
  title,
  months,
  selectedIndex,
  selectedLabel,
  onSelect,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [periodSelectorLayout, setPeriodSelectorLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // 월 스크롤
  const monthScrollRef = useRef<ScrollView>(null);
  const monthPillRefs = useRef<(View | null)[]>([]);

  // 로그인 상태
  const [user, setUser] = useState<StoredUser | null>(null);

  // 회원 정보 가져오기
  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  // 선택된 월이 변경=> 선택된 월ㄹㅇ보이도록 스크롤
  useEffect(() => {
    const timer = setTimeout(() => {
      if (monthScrollRef.current && monthPillRefs.current[selectedIndex]) {
        monthPillRefs.current[selectedIndex]?.measureLayout(
          monthScrollRef.current as any,
          (x, y, width, height) => {
            //  중앙에 오도록 스크롤
            monthScrollRef.current?.scrollTo({
              x: Math.max(
                0,
                x - Dimensions.get('window').width / 2 + width / 2,
              ),
              animated: true,
            });
          },
          () => {
            const pillWidth = 60;
            const scrollX = Math.max(
              0,
              selectedIndex * pillWidth -
                Dimensions.get('window').width / 2 +
                pillWidth / 2,
            );
            monthScrollRef.current?.scrollTo({
              x: scrollX,
              animated: true,
            });
          },
        );
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedIndex]);

  const openPicker = () => setPickerOpen(true);
  const closePicker = () => setPickerOpen(false);
  const handleSelect = (index: number) => {
    onSelect(index);
    closePicker();
  };

  // 드롭다운 위치
  const pickerStyle =
    buttonLayout && periodSelectorLayout
      ? {
          top: periodSelectorLayout.height + 20,
          left: buttonLayout.x,
          width: buttonLayout.width,
        }
      : null;

  return (
    <View style={statisticsStyles.header}>
      <View style={statisticsStyles.headerTopRow}>
        <View style={statisticsStyles.profileWrap}>
          <View
            style={[
              statisticsStyles.avatar,
              {
                backgroundColor: theme.colors.white,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <Image
              source={logoImg}
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: theme.colors.text,
            }}
          >
            {user?.name ? `${user.name} 님` : '사용자'}
          </Text>
        </View>
      </View>

      <Text style={statisticsStyles.headerTitle}>{title}</Text>

      <View style={{ position: 'relative' }}>
        <View
          style={statisticsStyles.periodSelector}
          onLayout={event => setPeriodSelectorLayout(event.nativeEvent.layout)}
        >
          <Text style={{ fontSize: 15, color: theme.colors.gray600 }}>
            월별
          </Text>
          <TouchableOpacity
            style={statisticsStyles.dropdownButton}
            activeOpacity={0.8}
            onPress={openPicker}
            onLayout={event => setButtonLayout(event.nativeEvent.layout)}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: theme.colors.text,
              }}
            >
              {selectedLabel}
            </Text>
            <Ionicons name="chevron-down" size={16} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {pickerOpen && pickerStyle && (
          <View style={[statisticsStyles.monthPickerBase, pickerStyle]}>
            <ScrollView
              style={statisticsStyles.monthPickerScroll}
              showsVerticalScrollIndicator={false}
            >
              {months.map((month, index) => {
                const active = index === selectedIndex;
                return (
                  <Pressable
                    key={month}
                    style={[
                      statisticsStyles.monthPickerItem,
                      active && statisticsStyles.monthPickerItemActive,
                    ]}
                    onPress={() => handleSelect(index)}
                  >
                    <Text
                      style={[
                        statisticsStyles.monthPickerLabel,
                        active && statisticsStyles.monthPickerLabelActive,
                      ]}
                    >
                      {month}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>

      <ScrollView
        ref={monthScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={statisticsStyles.monthScroll}
      >
        {months.map((month, index) => {
          const active = index === selectedIndex;
          return (
            <View
              key={month}
              ref={el => {
                monthPillRefs.current[index] = el;
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onSelect(index)}
                style={[
                  statisticsStyles.monthPill,
                  active && statisticsStyles.monthPillActive,
                ]}
              >
                <Text
                  style={[
                    statisticsStyles.monthLabel,
                    active && statisticsStyles.monthLabelActive,
                  ]}
                >
                  {month}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
