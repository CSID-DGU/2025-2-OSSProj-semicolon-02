package com.caffit.intake.dto;

import java.time.LocalDateTime;

public record IntakeDTO(
        Long id,
        Long userId,
        Long beverageId,
        String beverageName,
        double volumeMl,
        double caffeineMg,
        LocalDateTime consumedAt,
        String note
) {}

