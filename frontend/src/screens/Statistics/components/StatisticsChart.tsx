import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {statisticsStyles} from '../../../styles/statisticsStyles';
import {theme} from '../../../styles/theme';

type ChartPoint = {hour: string; mg: number; target: number};

type Props = {
  data: ChartPoint[];
  targetLabel: string;
  caption?: string;
  monthLabel?: string;
};

export default function StatisticsChart({data, targetLabel, caption, monthLabel,}: Props) {
  const maxValue = Math.max(...data.map(point => point.mg), 500);
  const minValue = 0;

  return (
    <View style={statisticsStyles.chartCard}>
      {caption ? (
        <View style={statisticsStyles.sectionHeaderRow}>
          <Text style={statisticsStyles.sectionTitle}>{caption}</Text>
          <Text style={statisticsStyles.subtle}>목표 {targetLabel}</Text>
        </View>
      ) : null}

      <View style={statisticsStyles.chartAxes}>
        <View style={statisticsStyles.chartYAxis}>
          {[500, 400, 300, 200, 100].map(value => (
            <Text key={value} style={statisticsStyles.chartYAxisLabel}>
              {value}mg
            </Text>
          ))}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={statisticsStyles.chartScrollArea}>
          {data.map(point => {
            const ratio = (point.mg - minValue) / (maxValue - minValue || 1);
            const barHeight = Math.max(16, ratio * 140);
            const dotTop = 140 - (point.target / maxValue) * 140;

            return (
              <View key={point.hour} style={statisticsStyles.chartColumn}>
                <View
                  style={[
                    statisticsStyles.chartBar,
                    {height: barHeight, backgroundColor: theme.colors.primary},
                  ]}
                />
                <View
                  style={[
                    statisticsStyles.chartDot,
                    {
                      top: dotTop,
                      backgroundColor: theme.colors.accent,
                    },
                  ]}
                />
                <Text style={statisticsStyles.chartXAxisLabel}>
                  {point.hour}시
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}