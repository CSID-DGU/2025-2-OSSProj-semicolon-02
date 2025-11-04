import React, {useMemo,useState} from 'react';
import {ScrollView, View} from 'react-native';
import StatisticsHeader from './components/StatisticsHeader';
import StatisticsChart from './components/StatisticsChart';
import DrinkList from './components/DrinkList';
import {statisticsStyles} from '../../styles/statisticsStyles';
import {
    months,
    chartDataByMonth,
    popularDrinksByMonth,
  } from './mockData';
  
export default function StatisticsScreen() {
  const [selectedMonth, setSelectedMonth] = useState(4); // 0-index (10월)

  const monthLabel = months[selectedMonth];               
  const currentChart = useMemo(
    () => chartDataByMonth[monthLabel] ?? [],
    [monthLabel],
  );                                                      
  const currentDrinks = useMemo(
    () => popularDrinksByMonth[monthLabel] ?? [],
    [monthLabel],
  );             
  return (
    <View style={statisticsStyles.screen}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={statisticsStyles.container}>
        <StatisticsHeader
          title="나의 카페인 레포트"
          months={months}
          selectedIndex={selectedMonth}
          selectedLabel={monthLabel} 
          onSelect={setSelectedMonth}
        />
        <View style={statisticsStyles.section}>
          <StatisticsChart
            monthLabel={monthLabel}           
            data={currentChart}    
            targetLabel="400mg"
            caption="시간대별 카페인 농도"
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
  );
}