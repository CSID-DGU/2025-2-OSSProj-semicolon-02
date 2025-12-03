import React, { useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { statisticsStyles } from '../../../styles/statisticsStyles';
import { theme } from '../../../styles/theme';

type DateChartPoint = {
  date: string;
  mg: number;
  target: number;
};

type Props = {
  data: DateChartPoint[];
  targetLabel: string;
  caption?: string;
  monthLabel?: string;
};

export default function StatisticsDateLineChart({
  data,
  targetLabel,
  caption,
  monthLabel,
}: Props) {
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(
    null,
  );

  // 데이터가 없을 때 빈 상태 처리
  if (!data || data.length === 0) {
    return (
      <View style={statisticsStyles.chartCard}>
        {caption ? (
          <View style={statisticsStyles.sectionHeaderRow}>
            <Text style={statisticsStyles.sectionTitle}>{caption}</Text>
            <Text style={statisticsStyles.subtle}>목표 {targetLabel}</Text>
          </View>
        ) : null}
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: theme.colors.gray500 }}>데이터가 없습니다</Text>
        </View>
      </View>
    );
  }

  // 데이터가 9개 이상이면 레이블에서 한글 "일"만 제거하고 점 크기도 줄임
  const shouldRemoveDayLabel = data.length > 9;
  const pointRadius = shouldRemoveDayLabel ? 4 : 6; // 9개 이상이면 점 크기 줄임
  const chartData = data.map((point, index) => {
    const label = shouldRemoveDayLabel
      ? point.date.replace(/일$/g, '')
      : point.date;

    return {
      value: point.mg,
      label,
      frontColor: theme.colors.primary,
      labelTextStyle: {
        color: theme.colors.gray500,
        fontSize: 9, // 더 작은 폰트로 더 많은 레이블 표시
      },
    };
  });

  const screenWidth = Dimensions.get('window').width;
  // 화면 크기에 맞춰 적절한 간격 설정 (한 화면에 약 10-12개 정도 보이도록)
  const availableWidth = screenWidth - 100; // Y축 공간 제외
  const targetVisibleItems = 10;
  const preferredSpacing = availableWidth / targetVisibleItems;

  const minSpacing = 25;
  const maxSpacing = 40;

  const calculatedSpacing = Math.max(
    minSpacing,
    Math.min(maxSpacing, preferredSpacing),
  );

  const chartWidth = Math.max(
    data.length * calculatedSpacing,
    availableWidth + 100,
  );

  return (
    <View style={statisticsStyles.chartCard}>
      {caption ? (
        <View style={statisticsStyles.sectionHeaderRow}>
          <Text style={statisticsStyles.sectionTitle}>{caption}</Text>
          <Text
            style={[
              statisticsStyles.subtle,
              { marginRight: theme.spacing(-2) },
            ]}
          >
            (단위: mg)
          </Text>
        </View>
      ) : null}

      <View style={statisticsStyles.chartAxes}>
        <View
          style={[
            statisticsStyles.chartYAxis,
            {
              height: 180,
              position: 'relative',
              justifyContent: 'space-between',
              paddingVertical: 0,
            },
          ]}
        >
          {[500, 400, 300, 200, 100].map((value, index) => {
            // 400mg  빨간색
            const isTargetValue = value === 400;

            const sectionHeight = 180 / 5; // 36px
            const gridLinePosition = index * sectionHeight;

            return (
              <Text
                key={value}
                style={[
                  statisticsStyles.chartYAxisLabel,
                  {
                    position: 'absolute',
                    top: gridLinePosition,
                    textAlign: 'right',
                    marginRight: -4,
                    lineHeight: 16,
                    color: isTargetValue ? '#FF0000' : theme.colors.gray500,
                  },
                ]}
              >
                {value}
              </Text>
            );
          })}
        </View>

        {/* Line Chart (점 + 선) */}
        <View style={{ flex: 1, position: 'relative' }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            scrollEnabled={true}
            bounces={false}
            contentContainerStyle={{
              paddingLeft: theme.spacing(0.25),
              minWidth: chartWidth, // 최소 너비를 차트 너비로 설정하여 스크롤 가능하도록
            }}
            style={{ flex: 1 }}
          >
            <View style={{ width: chartWidth, position: 'relative' }}>
              <LineChart
                data={chartData}
                height={180}
                width={chartWidth}
                spacing={calculatedSpacing}
                thickness={2}
                color={theme.colors.primary}
                dataPointsColor={theme.colors.primary}
                dataPointsRadius={pointRadius} // 점 크기 (9개 이상이면 작게)
                textColor={theme.colors.gray500}
                textFontSize={9}
                hideRules={false} // 그리드 라인
                rulesType="solid"
                rulesColor={theme.colors.gray300}
                hideYAxisText={true}
                xAxisColor={theme.colors.gray300}
                yAxisColor={theme.colors.gray300}
                yAxisThickness={1}
                xAxisThickness={1}
                maxValue={500}
                noOfSections={5}
                xAxisLabelTextStyle={{
                  color: theme.colors.gray500,
                  fontSize: 9, // 더 작은 폰트
                }}
                curved={true} // false-직선, true-곡선
                animateOnDataChange={true}
                animationDuration={1000}
                // 400mg 빨간 ㅇ라인
                showReferenceLine1={true}
                referenceLine1Position={400}
                referenceLine1Config={{
                  color: '#FF0000', // 빨간색
                  thickness: 1,
                  type: 'solid',
                }}
              />
              {/* 각 데이터 포인트 위에 투명한 터치 영역 오버레이 */}
              {data.map((point, index) => {
                const pointX =
                  index * calculatedSpacing + calculatedSpacing / 2;
                const pointY = 180 - (point.mg / 500) * 180; // Y축 반전 (0이 아래)

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedPointIndex(
                        selectedPointIndex === index ? null : index,
                      );
                    }}
                    activeOpacity={1}
                    style={{
                      position: 'absolute',
                      left: pointX - 20, // 터치 영역 확대 (40x40)
                      top: pointY - 20,
                      width: 40,
                      height: 40,
                      backgroundColor: 'transparent',
                    }}
                  />
                );
              })}
              {/* 툴팁 표시 */}
              {selectedPointIndex !== null &&
                (() => {
                  const point = data[selectedPointIndex];
                  const pointX =
                    selectedPointIndex * calculatedSpacing +
                    calculatedSpacing / 2;
                  const pointY = 180 - (point.mg / 500) * 180;

                  // 위쪽 점(낮은 pointY, 높은 mg 값): 툴팁을 점 위에
                  // 아래쪽 점(높은 pointY, 낮은 mg 값): 툴팁을 점 아래에
                  const chartMidPoint = 90; // 차트 높이 180의 중간
                  const isUpperHalf = pointY < chartMidPoint;

                  // 위쪽 점: 툴팁을 더 위로 올림 (점 위쪽에 명확히 표시)
                  // 아래쪽 점: 툴팁을 아래로 (점 아래쪽에 명확히 표시)
                  const tooltipTop = isUpperHalf
                    ? Math.max(0, pointY - 55) // 위쪽: 점보다 더 위로
                    : pointY + 20; // 아래쪽: 점 아래로

                  return (
                    <View
                      style={{
                        position: 'absolute',
                        left: pointX - 40,
                        top: tooltipTop,
                        zIndex: 1000,
                        backgroundColor: '#CD853F', // 진한 갈색 배경
                        paddingHorizontal: theme.spacing(1.5),
                        paddingVertical: theme.spacing(0.5),
                        borderRadius: theme.radius.md,
                        shadowColor: '#000',
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: '#FFFFFF', // 흰색 텍스트 (진한 배경에 대비)
                          fontSize: 11,
                          fontWeight: '600',
                        }}
                      >
                        {point.date}: {point.mg}mg
                      </Text>
                    </View>
                  );
                })()}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
