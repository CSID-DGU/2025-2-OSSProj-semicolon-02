// src/screens/Statistics/components/StatisticsDateLineChart.tsx
import React from 'react';
import {View, Text, Dimensions, ScrollView} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';
import {statisticsStyles} from '../../../styles/statisticsStyles';
import {theme} from '../../../styles/theme';

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
  // react-native-gifted-charts 
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
          <Text style={statisticsStyles.subtle}>목표 {targetLabel}</Text>
        </View>
      ) : null}

      <View style={statisticsStyles.chartAxes}>
        {/* Y축 레이블 (왼쪽) */}
        <View style={statisticsStyles.chartYAxis}>
          {[500, 400, 300, 200, 100].reverse().map(value => (
            <Text
              key={value}
              style={[
                statisticsStyles.chartYAxisLabel,
                {marginVertical: 0, lineHeight: 36},
              ]}>
              {value}mg
            </Text>
          ))}
        </View>

        {/* Line Chart (점 + 선) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={statisticsStyles.chartScrollArea}>
          <View style={{width: chartWidth}}>
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
              rulesColor={theme.colors.gray300 || '#D9D9D9'}
              hideYAxisText={true} // Y축 텍스트 숨기기 (왼쪽에 따로 표시)
              xAxisColor={theme.colors.gray300 || '#D9D9D9'}
              yAxisColor={theme.colors.gray300 || '#D9D9D9'}
              yAxisThickness={1}
              xAxisThickness={1}
              maxValue={500}
              noOfSections={5}
              curved={true} //false-직선, true0곡선ㄴ
              animateOnDataChange={true} // 데이터 변경 시 애니메이션
              animationDuration={1000}
              showDataPoint1={true}  
              showDataPoint2={true}  
              // 모든 점 표시
              // showDataPoints={true}
              customDataPoint={(item: any, index: number) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: theme.colors.primary,
                      borderWidth: 2,
                      borderColor: theme.colors.white,
                    }}
                  />
                );
              }}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}