// com.caffit.sleep.SleepLogController.java

package com.caffit.sleep;

import com.caffit.user.User;
import com.caffit.user.UserRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/sleep")
public class SleepLogController {

    private record SleepLogReq(
            Long userId,
            LocalDateTime sleepAt,
            LocalDateTime wakeAt
    ) {
    }

    private record SleepLogRes(
            Long id,
            LocalDateTime sleepAt,
            LocalDateTime wakeAt,
            int durationMinutes
    ) {
        static SleepLogRes from(SleepLog log) {
            return new SleepLogRes(
                    log.getId(),
                    log.getSleepAt(),
                    log.getWakeAt(),
                    log.getDurationMinutes()
            );
        }
    }

    private record TodaySleepRes(
            boolean exists,
            Long id,
            LocalDateTime sleepAt,
            LocalDateTime wakeAt,
            Integer durationMinutes
    ) {
        static TodaySleepRes empty() {
            return new TodaySleepRes(false, null, null, null, null);
        }

        static TodaySleepRes of(SleepLog log) {
            return new TodaySleepRes(
                    true,
                    log.getId(),
                    log.getSleepAt(),
                    log.getWakeAt(),
                    log.getDurationMinutes()
            );
        }
    }

    private final SleepLogRepository sleepLogs;
    private final UserRepository users;

    public SleepLogController(SleepLogRepository sleepLogs, UserRepository users) {
        this.sleepLogs = sleepLogs;
        this.users = users;
    }


    //수면 기록 저장
    @PostMapping
    public SleepLogRes create(@RequestBody SleepLogReq req) {
        User u = users.findById(req.userId()).orElseThrow();

        LocalDateTime sleepAt = req.sleepAt();
        LocalDateTime wakeAt = req.wakeAt();
        if (sleepAt == null || wakeAt == null) {
            throw new IllegalArgumentException("sleepAt, wakeAt은 필수입니다.");
        }

        SleepLog saved = sleepLogs.save(new SleepLog(u, sleepAt, wakeAt));
        return SleepLogRes.from(saved);
    }


     //홈 화면용: 가장 최근 수면 기록 1건 조회

    @GetMapping("/today")
    public TodaySleepRes today(@RequestParam("userId") Long userId) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = start.plusDays(1);

        Optional<SleepLog> latest =
                sleepLogs.findTop1ByUser_IdAndWakeAtBetweenOrderByWakeAtDesc(userId, start, end);

        return latest.map(TodaySleepRes::of).orElseGet(TodaySleepRes::empty);
    }
    
    // GET /api/sleep/history?userId=1&days=7    
    @GetMapping("/history")
    public List<SleepLogRes> history(
            @RequestParam("userId") Long userId,
            @RequestParam(value = "days", required = false, defaultValue = "7") int days
    ) {
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start = end.minusDays(days);

        List<SleepLog> logs = sleepLogs.findByUser_IdAndSleepAtBetween(userId, start, end);
        return logs.stream().map(SleepLogRes::from).toList();
    }
    
    // PUT /api/sleep/{id}
    @PutMapping("/{id}")
    public SleepLogRes update(
            @PathVariable Long id,
            @RequestBody SleepLogReq req
    ) {
        SleepLog log = sleepLogs.findById(id).orElseThrow();

        LocalDateTime sleepAt = req.sleepAt();
        LocalDateTime wakeAt = req.wakeAt();
        if (sleepAt == null || wakeAt == null) {
            throw new IllegalArgumentException("sleepAt, wakeAt은 필수입니다.");
        }

        log.updateTimes(sleepAt, wakeAt);     
        SleepLog saved = sleepLogs.save(log);  

        return SleepLogRes.from(saved);
    }
}
