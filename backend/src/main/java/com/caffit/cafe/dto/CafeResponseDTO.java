package com.caffit.cafe.dto;

import com.caffit.cafe.domain.Cafe;

public record CafeResponseDTO(
        Long id,
        String name,
        String address,
        double lat,
        double lng,
        double distance
) {
    public static CafeResponseDTO from(Cafe cafe, double distance) {
        return new CafeResponseDTO(
                cafe.getId(),
                cafe.getName(),
                cafe.getAddress(),
                cafe.getLat(),
                cafe.getLng(),
                distance
        );
    }
}