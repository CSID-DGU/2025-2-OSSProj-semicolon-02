import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatisticsHeader from './components/StatisticsHeader';
import StatisticsDateLineChart from './components/StatisticsLineChart';
import DrinkList from './components/DrinkList';
import { statisticsStyles } from '../../styles/statisticsStyles';
import { months, type Drink } from './mockData';
import {
  fetchMonthlyDateChartByLabel,
  fetchMonthlyDateChart,
} from '../../api/statistics';
import { fetchIntakes, fetchIntakesByMonth } from '../../api/intakes';
import { getCurrentUser } from '../../lib/authSession';
import type { DateChartPoint } from '../../types/statistics';
import type { IntakeDTO } from '../../types/intake';

// 현재 월을 months 배열의 인덱스
const getCurrentMonthIndex = (): number => {
  const currentMonth = new Date().getMonth() + 1;
  const currentMonthLabel = `${currentMonth}월`;
  const index = months.indexOf(currentMonthLabel);
  return index >= 0 ? index : 0;
};

// IntakeDTO를 Drink 타입으로 변환하는 함수
const convertIntakeToDrink = (intake: IntakeDTO): Drink => {
  // note 필드에 실제 음료 이름이 들어있으므로 note를 우선 사용
  // note가 없으면 beverageName 사용
  const drinkName = intake.note || intake.beverageName;

  // "아이스 말차 라떼" 같은 형식이므로 첫 단어를 brand로 분리
  const parts = drinkName.split(' ');
  const brand = parts.length > 1 ? parts[0] : '';
  const name = parts.length > 1 ? parts.slice(1).join(' ') : drinkName;

  return {
    id: String(intake.id),
    brand,
    name,
    price: 0,
    favorite: false,
  };
};

const getYearAndMonth = (
  monthLabel: string,
  intakes?: IntakeDTO[],
): { year: number; month: number } => {
  const month = parseInt(monthLabel.replace('월', ''), 10);

  if (intakes && intakes.length > 0) {
    console.log(
      `[Statistics] Searching for ${monthLabel} data in ${intakes.length} intakes`,
    );

    const yearsWithMonthData = new Set<number>();
    let monthDataCount = 0;
    intakes.forEach(intake => {
      const date = new Date(intake.consumedAt);
      const intakeMonth = date.getMonth() + 1;
      const intakeYear = date.getFullYear();

      if (intakeMonth === month) {
        yearsWithMonthData.add(intakeYear);
        monthDataCount++;
      }
    });

    console.log(
      `[Statistics] Found ${monthDataCount} items for ${monthLabel} across years:`,
      Array.from(yearsWithMonthData),
    );

    // 해당 월의 데이터가 있는 연도가 있으면 가장 최근 연도 사용
    if (yearsWithMonthData.size > 0) {
      const sortedYears = Array.from(yearsWithMonthData).sort((a, b) => b - a);
      const selectedYear = sortedYears[0];
      console.log(
        `[Statistics] Using year ${selectedYear} for ${monthLabel} (found in years: ${sortedYears.join(
          ', ',
        )})`,
      );
      return { year: selectedYear, month };
    }

    const latestIntake = intakes[0];
    const latestDate = new Date(latestIntake.consumedAt);
    const latestYear = latestDate.getFullYear();
    console.log(
      `[Statistics] No data for ${monthLabel}, using latest year ${latestYear}`,
    );
    return { year: latestYear, month };
  }

  // 데이터가 없으면 현재 연도 사용
  const currentYear = new Date().getFullYear();
  return { year: currentYear, month };
};

export default function StatisticsScreen() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthIndex());
  const [dateChartData, setDateChartData] = useState<DateChartPoint[]>([]);
  const [recentDrinks, setRecentDrinks] = useState<Drink[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [isLoadingDrinks, setIsLoadingDrinks] = useState(false);
  const [allIntakes, setAllIntakes] = useState<IntakeDTO[]>([]);

  const monthLabel = months[selectedMonth];

  // 모든 intake를 먼저 가져와서 연도 추출
  const [availableYears, setAvailableYears] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadAllIntakes = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          setAllIntakes([]);
          setAvailableYears(new Set());
          return;
        }
        const intakes = await fetchIntakes(user.id);
        console.log(
          '[Statistics] All intakes loaded for year detection:',
          intakes.length,
        );

        // 모든 연도 추출
        const years = new Set<number>();
        intakes.forEach(intake => {
          const date = new Date(intake.consumedAt);
          years.add(date.getFullYear());
        });
        console.log(
          '[Statistics] Available years:',
          Array.from(years).sort((a, b) => b - a),
        );

        if (intakes.length > 0) {
          const latestDate = new Date(intakes[0].consumedAt);
          console.log(
            '[Statistics] Latest intake date:',
            latestDate.getFullYear(),
            latestDate.getMonth() + 1,
          );
        }
        setAllIntakes(intakes);
        setAvailableYears(years);
      } catch (error) {
        console.error('Failed to load intakes:', error);
        setAllIntakes([]);
        setAvailableYears(new Set());
      }
    };
    loadAllIntakes();
  }, []);

  const { year, month } = getYearAndMonth(monthLabel, allIntakes);

  // 백엔드에서 월별 일별 카페인 섭취량 그래프 데이터 가져오기
  useEffect(() => {
    const loadDateChart = async () => {
      setIsLoadingChart(true);
      try {
        const user = await getCurrentUser();
        if (!user) {
          setDateChartData([]);
          return;
        }

        console.log('[Statistics] Loading chart data:', {
          userId: user.id,
          monthLabel,
          year,
          month,
        });
        // 실제 데이터가 있는 연도를 사용
        const { year: dataYear, month: dataMonth } = getYearAndMonth(
          monthLabel,
          allIntakes,
        );
        console.log(
          '[Statistics] Using year for chart:',
          dataYear,
          'month:',
          dataMonth,
        );

        // fetchMonthlyDateChart를 직접 사용하여 연도 지정
        console.log('[Statistics] Calling API with:', {
          userId: user.id,
          year: dataYear,
          month: dataMonth,
        });
        const data = await fetchMonthlyDateChart(user.id, dataYear, dataMonth);
        console.log('[Statistics] Chart data received:', {
          monthLabel,
          dataLength: data.length,
          data,
        });
        setDateChartData(data);
      } catch (error) {
        console.error('Failed to fetch date chart:', error);
        setDateChartData([]);
      } finally {
        setIsLoadingChart(false);
      }
    };

    loadDateChart();
  }, [monthLabel, year, month, allIntakes]);

  // 백엔드에서 최근에 마신 음료 데이터 가져오기
  useEffect(() => {
    const loadRecentDrinks = async () => {
      setIsLoadingDrinks(true);
      try {
        const user = await getCurrentUser();
        if (!user) {
          setRecentDrinks([]);
          return;
        }

        // 백엔드에서 월별로 필터링된 데이터 받기 (consumed_at 기준) - 효율적!
        let monthIntakes: IntakeDTO[];
        try {
          console.log('[Statistics] Fetching monthly intakes from backend:', {
            userId: user.id,
            year,
            month,
          });
          monthIntakes = await fetchIntakesByMonth(user.id, year, month);
          console.log(
            '[Statistics] Monthly intakes received from backend:',
            monthIntakes.length,
            'items',
          );
        } catch (apiError) {
          // 백엔드 API가 안 되면 프론트엔드에서 필터링 (fallback)
          console.warn(
            '[Statistics] Backend API failed, using frontend filtering:',
            apiError,
          );
          monthIntakes = allIntakes.filter(intake => {
            try {
              const date = new Date(intake.consumedAt);
              const intakeYear = date.getFullYear();
              const intakeMonth = date.getMonth() + 1;
              return intakeYear === year && intakeMonth === month;
            } catch (e) {
              return false;
            }
          });
          console.log(
            '[Statistics] Filtered monthly intakes (frontend):',
            monthIntakes.length,
            'items',
          );
        }

        // 최대 10개만 표시
        const limitedIntakes = monthIntakes.slice(0, 10);

        // IntakeDTO를 Drink 타입으로 변환
        const drinks = limitedIntakes.map(convertIntakeToDrink);
        setRecentDrinks(drinks);
      } catch (error) {
        console.error('Failed to fetch recent drinks:', error);
        setRecentDrinks([]);
      } finally {
        setIsLoadingDrinks(false);
      }
    };

    loadRecentDrinks();
  }, [monthLabel, year, month, allIntakes]);
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
              data={dateChartData}
              targetLabel="400mg"
              caption={`${monthLabel} 카페인 섭취량`}
            />
          </View>
          <View style={statisticsStyles.section}>
            <DrinkList
              title="최근에 마신 음료"
              items={recentDrinks}
              monthLabel={monthLabel}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
