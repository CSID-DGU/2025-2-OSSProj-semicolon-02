// com.caffit.intake.IntakeController.java
package com.caffit.intake;

import com.caffit.beverage.Beverage;
import com.caffit.beverage.BeverageRepository;
import com.caffit.user.User;
import com.caffit.user.UserRepository;
import java.time.LocalDateTime;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/intakes")
public class IntakeController {
    private record CreateReq(Long userId, Long beverageId, double volumeMl, double caffeineMg, String note,
                            LocalDateTime consumedAt) {}
    private final IntakeRepository intakes;
    private final UserRepository users;
    private final BeverageRepository beverages;

    public IntakeController(IntakeRepository intakes, UserRepository users, BeverageRepository beverages) {
        this.intakes = intakes;
        this.users = users;
        this.beverages = beverages;
    }

    @PostMapping
    public Long create(@RequestBody CreateReq req) {
        User u = users.findById(req.userId()).orElseThrow();
        Beverage b = beverages.findById(req.beverageId()).orElseThrow();
        LocalDateTime at = req.consumedAt() != null ? req.consumedAt() : LocalDateTime.now();
        Intake saved = intakes.save(new Intake(u, b, at, req.volumeMl(), req.caffeineMg(), req.note()));
        return saved.getId();
    }
}
