// com.caffit.intake.IntakeController.java
package com.caffit.intake;

import com.caffit.beverage.Beverage;
import com.caffit.beverage.BeverageRepository;
import com.caffit.user.User;
import com.caffit.user.UserRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/intakes")
public class IntakeController {

    private record CreateReq(
            Long userId,
            Long beverageId,
            double volumeMl,
            double caffeineMg,
            String note,
            LocalDateTime consumedAt
    ) {}

    // 수동 등록용: 브랜드/이름/카페인/용량만 받아서 Beverage + Intake 한 번에 생성
    private record ManualCreateReq(
            Long userId,
            String brand,
            String name,
            double caffeineMg,
            Double volumeMl,
            String note,
            LocalDateTime consumedAt
    ) {}

    // 홈 화면용 오늘 요약 DTO
    public record TodaySummaryRes(
            double totalCaffeineMg,
            int count
    ) {}

    private final IntakeRepository intakes;
    private final UserRepository users;
    private final BeverageRepository beverages;

    public IntakeController(IntakeRepository intakes,
                            UserRepository users,
                            BeverageRepository beverages) {
        this.intakes = intakes;
        this.users = users;
        this.beverages = beverages;
    }

    @PostMapping
    public Long create(@RequestBody CreateReq req) {
        User u = users.findById(req.userId()).orElseThrow();
        Beverage b = beverages.findById(req.beverageId()).orElseThrow();

        LocalDateTime at = req.consumedAt() != null
                ? req.consumedAt()
                : LocalDateTime.now();

        Intake saved = intakes.save(
                new Intake(u, b, at, req.volumeMl(), req.caffeineMg(), req.note())
        );
        return saved.getId();
    }

    /**
     * 수동 등록: 음료 마스터에 없더라도 한 번에 등록 (임시 Beverage 생성)
     */
    @PostMapping("/manual")
    public Long manualCreate(@RequestBody ManualCreateReq req) {
        User u = users.findById(req.userId()).orElseThrow();

        double volume = req.volumeMl() != null ? req.volumeMl() : 0.0;
        String fullName = (req.brand() != null && !req.brand().isBlank())
                ? req.brand() + " " + req.name()
                : req.name();

        Beverage bev = beverages.save(
                new Beverage(fullName, req.caffeineMg(), volume)
        );

        LocalDateTime at = req.consumedAt() != null
                ? req.consumedAt()
                : LocalDateTime.now();

        Intake saved = intakes.save(
                new Intake(u, bev, at, volume, req.caffeineMg(), req.note())
        );
        return saved.getId();
    }

    /**
     * 오늘 섭취 요약
     * TODO: userId는 로그인 세션에서 받도록 변경 필요 
     */
    @GetMapping("/today-summary")
    public TodaySummaryRes todaySummary(@RequestParam Long userId) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(LocalTime.MAX);

        List<Intake> list = intakes.findByUser_IdAndConsumedAtBetween(userId, start, end);

        double totalMg = list.stream()
                .mapToDouble(Intake::getCaffeineMg)
                .sum();
        int count = list.size();

        return new TodaySummaryRes(totalMg, count);
    }
}
