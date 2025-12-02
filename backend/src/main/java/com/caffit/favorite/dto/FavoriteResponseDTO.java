package com.caffit.favorite.dto;

import java.time.LocalDateTime;

public record FavoriteResponseDTO(
    Long id,
    Long userId,
    Long beverageId,
    String brand,
    String name,
    double caffeineMg,
    double volumeMl,
    LocalDateTime createdAt
) {}
