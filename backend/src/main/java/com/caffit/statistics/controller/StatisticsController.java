// com.caffit.statistics.controller.StatisticsController.java
package com.caffit.statistics.controller;

import com.caffit.intake.entity.Intake;
import com.caffit.intake.repository.IntakeRepository;
import com.caffit.statistics.dto.DateChartPointDTO;
import com.caffit.statistics.dto.FrequentDrinkDTO;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    private final IntakeRepository intakeRepository;

    public StatisticsController(IntakeRepository intakeRepository) {
        this.intakeRepository = intakeRepository;
    }


    //월별 날짜별 카페인 섭취량 조회
    @GetMapping("/monthly-date-chart")
    @Transactional(readOnly = true)
    public List<DateChartPointDTO> getMonthlyDateChart(
            @RequestParam("userId") Long userId,
            @RequestParam("year") int year,
            @RequestParam("month") int month
    ) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);

        // 해당 월의 모든 섭취 기록 조회
        List<Intake> intakes = intakeRepository.findByUser_IdAndConsumedAtBetween(userId, start, end);

        // 하루 총 카페인량 계산
        Map<LocalDate, List<Intake>> groupedByDate = intakes.stream()
                .collect(Collectors.groupingBy(i -> i.getConsumedAt().toLocalDate()));

        // DateChartPointDTO로 
        return groupedByDate.entrySet().stream()
                .map(entry -> {
                    LocalDate date = entry.getKey();
                    List<Intake> dayIntakes = entry.getValue();
                    
                    
                    String dateLabel = date.getDayOfMonth() + "일";
                    
                    // 하루 총 카페인 섭취량
                    Double totalMg = dayIntakes.stream()
                            .mapToDouble(Intake::getCaffeineMg)
                            .sum();
                    
                    //  400mg
                    Double target = 400.0;

                    return new DateChartPointDTO(dateLabel, totalMg, target);
                })
                .sorted((a, b) -> {
                    // "일" 제거 후 숫자로 비교하여 정렬
                    int dayA = Integer.parseInt(a.date().replace("일", ""));
                    int dayB = Integer.parseInt(b.date().replace("일", ""));
                    return Integer.compare(dayA, dayB);
                })
                .collect(Collectors.toList());
    }

 
    //월별 자주 마시는 음료 조회
    @GetMapping("/popular-drinks")
    @Transactional(readOnly = true)
    public List<FrequentDrinkDTO> getPopularDrinks(
            @RequestParam("userId") Long userId,
            @RequestParam("year") int year,
            @RequestParam("month") int month
    ) {
        // 월의 시작일과 종료일 계산
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);

        // 해당 월의 모든 섭취 기록 조회
        List<Intake> intakes = intakeRepository.findByUser_IdAndConsumedAtBetween(userId, start, end);

    
        Map<Long, List<Intake>> groupedByBeverage = intakes.stream()
                .collect(Collectors.groupingBy(i -> i.getBeverage().getId()));

        // FrequentDrinkDTO로 
        return groupedByBeverage.entrySet().stream()
                .map(entry -> {
                    Long beverageId = entry.getKey();
                    List<Intake> beverageIntakes = entry.getValue();
                    
                    String beverageName = beverageIntakes.get(0).getBeverage().getName();
                    Long count = (long) beverageIntakes.size();
                    Double totalCaffeineMg = beverageIntakes.stream()
                            .mapToDouble(Intake::getCaffeineMg)
                            .sum();

                    return new FrequentDrinkDTO(beverageId, beverageName, count, totalCaffeineMg);
                })
                .sorted((a, b) -> Long.compare(b.count(), a.count())) // count 내림차순 정렬
                .limit(10) // 상위 10개만 반환
                .collect(Collectors.toList());
    }
}

