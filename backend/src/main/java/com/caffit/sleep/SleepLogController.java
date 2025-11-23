// com.caffit.sleep.SleepLogController.java

package com.caffit.sleep;

import com.caffit.user.User;
import com.caffit.user.UserRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.web.bind.annotation.*;

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

    /**
     * 홈 화면용: "어제 취침 / 오늘 기상" 한 건만 필요할 때
     */
    private record TodaySleepRes(
            boolean exists,
            LocalDateTime sleepAt,
            LocalDateTime wakeAt,
            Integer durationMinutes
    ) {
        static TodaySleepRes empty() {
            return new TodaySleepRes(false, null, null, null);
        }

        static TodaySleepRes of(SleepLog log) {
            return new TodaySleepRes(
                    true,
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

    /**
     * 수면 기록 저장
     * POST /api/sleep
     *
     * {
     *   "userId": 1,
     *   "sleepAt": "2025-11-23T01:30:00",
     *   "wakeAt":  "2025-11-23T08:00:00"
     * }
     */
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

    /**
     * 홈 화면용: 가장 최근 수면 기록 1건 조회
     * GET /api/sleep/today?userId=1
     */
    @GetMapping("/today")
    public TodaySleepRes today(@RequestParam("userId") Long userId) {
        Optional<SleepLog> latest = sleepLogs.findTop1ByUser_IdOrderBySleepAtDesc(userId);
        return latest.map(TodaySleepRes::of).orElseGet(TodaySleepRes::empty);
    }
}
