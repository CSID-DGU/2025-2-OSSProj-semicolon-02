import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatisticsHeader from './components/StatisticsHeader';
import StatisticsChart from './components/StatisticsChart';
import StatisticsDateLineChart from './components/StatisticsLineChart';
import DrinkList from './components/DrinkList';
import { statisticsStyles } from '../../styles/statisticsStyles';
import { months, chartDataByMonth, popularDrinksByMonth } from './mockData';
import { dateChartDataByMonth } from './mockDataDate';

export default function StatisticsScreen() {
  const [selectedMonth, setSelectedMonth] = useState(4); // 0-index (10월)

  const monthLabel = months[selectedMonth];

//월별 카페인 섭취ㄹㅑㅇ
const currentDateChart = useMemo(
  () => dateChartDataByMonth[monthLabel] ?? [],
  [monthLabel],
);

 
  const currentDrinks = useMemo(
    () => popularDrinksByMonth[monthLabel] ?? [],
    [monthLabel],
  );
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#FCE3BB' }}
      edges={['top']}
    >
      <View style={[statisticsStyles.screen, { backgroundColor: '#FFFFFF' }]}>
        <StatisticsHeader
          title="나의 카페인 레포트"
          months={months}
          selectedIndex={selectedMonth}
          selectedLabel={monthLabel}
          onSelect={setSelectedMonth}
        />
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={statisticsStyles.container}
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <View style={statisticsStyles.section}>
          <StatisticsDateLineChart
              monthLabel={monthLabel}
              data={currentDateChart}
              targetLabel="400mg"
              caption={`${monthLabel} 일별 카페인 섭취량`}
            />
          </View>
          <View style={statisticsStyles.section}>
            <DrinkList
              title={`${monthLabel} 자주 마시는 음료`}
              items={currentDrinks}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
