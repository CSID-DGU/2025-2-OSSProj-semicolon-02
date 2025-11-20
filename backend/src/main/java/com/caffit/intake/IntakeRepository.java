// com.caffit.intake.IntakeRepository.java
package com.caffit.intake;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IntakeRepository extends JpaRepository<Intake, Long> { 
    List<Intake> findByUserIdOrderByConsumedAtDesc(Long userId);
}
