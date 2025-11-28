// src/screens/Statistics/components/StatisticsDateLineChart.tsx
import React from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
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

  // react-native-gifted-charts 형식으로 데이터 변환
  const chartData = data.map((point, index) => ({
    value: point.mg,
    label: point.date,
    frontColor: theme.colors.primary,
    labelTextStyle: {
      color: theme.colors.gray500,
      fontSize: 11,
    },
  }));

  const maxValue = Math.max(...data.map(point => point.mg), 500);
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.max(data.length * 50, screenWidth - 100);

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
        {/* Y축 레이블 (왼쪽) - 그리드 라인과 정렬 */}
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
            // 400mg 레이블만 빨간색으로 표시
            const isTargetValue = value === 400;

            // 레이블 간격을 줄이기 위해 lineHeight를 줄이고 margin 조정
            const sectionHeight = 180 / 5; // 36px
            const gridLinePosition = index * sectionHeight; // 그리드 라인 위치 (0, 36, 72, 108, 144)

            return (
              <Text
                key={value}
                style={[
                  statisticsStyles.chartYAxisLabel,
                  {
                    position: 'absolute',
                    top: gridLinePosition, // 그리드 라인
                    textAlign: 'right',
                    marginRight: -4, // 음수 마진으로 Y축에 더 가깝게
                    lineHeight: 16, // 간격 줄임 (20 -> 16)
                    color: isTargetValue ? '#FF0000' : theme.colors.gray500, // 400mg는 빨간색
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
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={statisticsStyles.chartScrollArea}
          >
            <View style={{ width: chartWidth }}>
              <LineChart
                data={chartData}
                height={180}
                width={chartWidth}
                spacing={Math.max(40, chartWidth / data.length - 5)}
                thickness={2} // 선 두께
                color={theme.colors.primary} // 선 색상
                dataPointsColor={theme.colors.primary} // 점 색상
                dataPointsRadius={6} // 점 크기
                textColor={theme.colors.gray500}
                textFontSize={11}
                hideRules={false} // 그리드 라인 표시
                rulesType="solid"
                rulesColor={theme.colors.gray300}
                hideYAxisText={true} // Y축 텍스트 숨기기 (왼쪽에 따로 표시)
                xAxisColor={theme.colors.gray300}
                yAxisColor={theme.colors.gray300}
                yAxisThickness={1}
                xAxisThickness={1}
                maxValue={500}
                noOfSections={5}
                curved={true} // false-직선, true-곡선
                animateOnDataChange={true} // 데이터 변경 시 애니메이션
                animationDuration={1000}
                // 400mg 위치의 빨간색 그리드 라인
                showReferenceLine1={true}
                referenceLine1Position={400}
                referenceLine1Config={{
                  color: '#FF0000', // 빨간색
                  thickness: 1,
                  type: 'solid',
                }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
