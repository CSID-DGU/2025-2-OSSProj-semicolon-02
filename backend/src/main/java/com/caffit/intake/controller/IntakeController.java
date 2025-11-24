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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import com.caffit.intake.dto.IntakeDTO;
import java.util.List;

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

    @GetMapping //섭취 기록 목록 조회
    @Transactional(readOnly = true)
    public List<IntakeDTO> list(@RequestParam(required = false) Long userId) {
        List<Intake> entries = (userId != null)
                ? intakes.findByUserIdOrderByConsumedAtDesc(userId)
                : intakes.findAll();
        return entries.stream()
                .map(i -> new IntakeDTO(
                        i.getId(),
                        i.getUser().getId(),
                        i.getBeverage().getId(),
                        i.getBeverage().getName(),
                        i.getVolumeMl(),
                        i.getCaffeineMg(),
                        i.getConsumedAt(),
                        i.getNote()
                ))
                .toList();
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

    @DeleteMapping("/{id}") // 섭취 기록 삭제-ID 로 삭제 
    public void delete(@PathVariable Long id) {
        intakes.deleteById(id);
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

        String note = req.note();
        if (note == null || note.isBlank()) {
            note = fullName;
        }
        
        Intake saved = intakes.save(
                new Intake(u, bev, at, volume, req.caffeineMg(), note)
        );
        return saved.getId();
    }

    /**
     * 오늘 섭취 요약
     * TODO: userId는 로그인 세션에서 받도록 변경 필요 
     */
    @GetMapping("/today-summary")
    public TodaySummaryRes todaySummary(@RequestParam("userId") Long userId) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(LocalTime.MAX);

        List<Intake> list = intakes.findByUser_IdAndConsumedAtBetween(userId, start, end);

        double totalMg = list.stream()
                .mapToDouble(Intake::getCaffeineMg)
                .sum();
        int count = list.size();

        // 디버깅용 로그
        System.out.println("[today-summary] userId=" + userId
                + ", size=" + list.size()
                + ", total=" + totalMg);

        return new TodaySummaryRes(totalMg, count);
    }
}
