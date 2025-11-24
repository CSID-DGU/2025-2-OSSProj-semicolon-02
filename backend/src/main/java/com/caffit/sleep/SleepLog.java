// com.caffit.sleep.SleepLog.java
package com.caffit.sleep;

import com.caffit.user.User;
import jakarta.persistence.*;
import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Table(name = "sleep_logs")
public class SleepLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sleep_log_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "sleep_at", nullable = false)
    private LocalDateTime sleepAt;

    @Column(name = "wake_at", nullable = false)
    private LocalDateTime wakeAt;

    @Column(name = "duration_minutes", nullable = false)
    private int durationMinutes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected SleepLog() {
    }

    public SleepLog(User user, LocalDateTime sleepAt, LocalDateTime wakeAt) {
        this.user = user;
        this.sleepAt = sleepAt;
        this.wakeAt = wakeAt;
        this.durationMinutes = calcDurationMinutes(sleepAt, wakeAt);
        this.createdAt = LocalDateTime.now();
    }

    private int calcDurationMinutes(LocalDateTime sleepAt, LocalDateTime wakeAt) {
        long minutes = Duration.between(sleepAt, wakeAt).toMinutes();
        // 사용자가 날짜를 잘 넣었다는 전제. 만약 음수면 24시간 더해 줌.
        if (minutes < 0) {
            minutes += 24 * 60;
        }
        return (int) minutes;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public LocalDateTime getSleepAt() {
        return sleepAt;
    }

    public LocalDateTime getWakeAt() {
        return wakeAt;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void updateTimes(LocalDateTime sleepAt, LocalDateTime wakeAt) {
        this.sleepAt = sleepAt;
        this.wakeAt = wakeAt;
        this.durationMinutes = calcDurationMinutes(sleepAt, wakeAt);
    }
}
