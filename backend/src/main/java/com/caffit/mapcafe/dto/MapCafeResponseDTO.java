package com.caffit.mapcafe.dto;

import com.caffit.mapcafe.domain.MapCafe;

public record MapCafeResponseDTO(
        Long id,
        String name,
        String address,
        double lat,
        double lng,
        double distance
) {
    public static MapCafeResponseDTO from(MapCafe mapCafe, double distance) {
        return new MapCafeResponseDTO(
                mapCafe.getId(),
                mapCafe.getName(),
                mapCafe.getAddress(),
                mapCafe.getLat(),
                mapCafe.getLng(),
                distance
        );
    }
}
