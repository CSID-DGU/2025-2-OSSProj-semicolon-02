// com.caffit.intake.IntakeRepository.java
package com.caffit.intake;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IntakeRepository extends JpaRepository<Intake, Long> {

    // 특정 유저의 기간별 섭취 내역
    List<Intake> findByUser_IdAndConsumedAtBetween(Long userId,
                                                   LocalDateTime start,
                                                   LocalDateTime end);
}