// 그래프 데이터
package com.caffit.statistics.dto;

public record DateChartPointDTO(
        String date,   
        Double mg,    
        Double target // 목표량 (400mg)
) {}

