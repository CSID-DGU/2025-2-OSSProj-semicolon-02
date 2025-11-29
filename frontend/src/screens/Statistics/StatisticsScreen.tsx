import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatisticsHeader from './components/StatisticsHeader';
import StatisticsDateLineChart from './components/StatisticsLineChart';
import DrinkList from './components/DrinkList';
import { statisticsStyles } from '../../styles/statisticsStyles';
import { months, popularDrinksByMonth, type Drink } from './mockData';
import { dateChartDataByMonth } from './mockDataDate';
// TODO: 백엔드 연동 준비
// import { fetchMonthlyDateChartByLabel, fetchPopularDrinksByLabel } from '../../api/statistics';
// import { getCurrentUser } from '../../lib/authSession';
// import type { DateChartPoint } from '../../types/statistics';
// import type { PopularDrinkDTO } from '../../api/statistics';

// 현재 월을 months 배열의 인덱스
const getCurrentMonthIndex = (): number => {
  const currentMonth = new Date().getMonth() + 1;
  const currentMonthLabel = `${currentMonth}월`;
  const index = months.indexOf(currentMonthLabel);
  return index >= 0 ? index : 0;
};

// TODO: 백엔드 연동 시 사용할 변환 함수
// PopularDrinkDTO를 Drink 타입으로 변환하는 함수
// const convertToDrink = (dto: PopularDrinkDTO): Drink => {
//   const parts = dto.beverageName.split(' ');
//   const brand = parts.length > 1 ? parts[0] : '';
//   const name = parts.length > 1 ? parts.slice(1).join(' ') : dto.beverageName;
//
//   return {
//     id: String(dto.beverageId),
//     brand,
//     name,
//     price: 0,
//     favorite: false,
//     count: dto.count,
//   };
// };

export default function StatisticsScreen() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthIndex());

  const monthLabel = months[selectedMonth];

  // TODO: 백엔드 연동 - 현재는 mockData 사용 중
  // 백엔드에서 월별 일별 카페인 섭취량 그래프 데이터 가져오기
  // useEffect(() => {
  //   const loadDateChart = async () => {
  //     setIsLoadingChart(true);
  //     try {
  //       const user = await getCurrentUser();
  //       if (!user) {
  //         setDateChartData([]);
  //         return;
  //       }

  //       const data = await fetchMonthlyDateChartByLabel(user.id, monthLabel);
  //       setDateChartData(data);
  //     } catch (error) {
  //       console.error('Failed to fetch date chart:', error);
  //       setDateChartData([]);
  //     } finally {
  //       setIsLoadingChart(false);
  //     }
  //   };

  //   loadDateChart();
  // }, [monthLabel]);

  // 백엔드에서 자주 마시는 음료 데이터 가져오기
  // useEffect(() => {
  //   const loadPopularDrinks = async () => {
  //     setIsLoadingDrinks(true);
  //     try {
  //       const user = await getCurrentUser();
  //       if (!user) {
  //         setPopularDrinks([]);
  //         return;
  //       }

  //       const drinks = await fetchPopularDrinksByLabel(user.id, monthLabel);
  //       const convertedDrinks = drinks.map(convertToDrink);
  //       setPopularDrinks(convertedDrinks);
  //     } catch (error) {
  //       console.error('Failed to fetch popular drinks:', error);
  //       setPopularDrinks([]);
  //     } finally {
  //       setIsLoadingDrinks(false);
  //     }
  //   };

  //   loadPopularDrinks();
  // }, [monthLabel]);

  // 현재는 mock 데이터 사용
  const currentDateChart = useMemo(() => {
    return dateChartDataByMonth[monthLabel] ?? [];
  }, [monthLabel]);

  const currentDrinks = useMemo(() => {
    return popularDrinksByMonth[monthLabel] ?? [];
  }, [monthLabel]);
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
              monthLabel={monthLabel}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
