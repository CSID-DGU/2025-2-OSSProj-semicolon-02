// 자주 마시는 음료 데이터
package com.caffit.statistics.dto;

public record FrequentDrinkDTO(
        Long beverageId,
        String beverageName,
        Long count,
        Double totalCaffeineMg
) {}

