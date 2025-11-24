// com.caffit.sleep.SleepLogRepository.java
package com.caffit.sleep;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SleepLogRepository extends JpaRepository<SleepLog, Long> {

    // 가장 최근 수면 기록 한 건
    Optional<SleepLog> findTop1ByUser_IdOrderBySleepAtDesc(Long userId);

    // 기간별 조회 (추후 통계용)
    List<SleepLog> findByUser_IdAndSleepAtBetween(Long userId,
            LocalDateTime start,
            LocalDateTime end);
}
