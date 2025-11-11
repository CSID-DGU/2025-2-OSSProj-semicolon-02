// com.caffit.intake.Intake.java
package com.caffit.intake;

import com.caffit.user.User;
import com.caffit.beverage.Beverage;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "intakes")
public class Intake {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "intake_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "beverage_id", nullable = false)
    private Beverage beverage;

    @Column(name = "consumed_at", nullable = false)
    private LocalDateTime consumedAt;

    @Column(name = "volume_ml", nullable = false)
    private double volumeMl;

    @Column(name = "caffeine_mg", nullable = false)
    private double caffeineMg;

    @Column(length = 300)
    private String note;

    protected Intake() {}

    public Intake(User user, Beverage beverage, LocalDateTime consumedAt,
                  double volumeMl, double caffeineMg, String note) {
        this.user = user;
        this.beverage = beverage;
        this.consumedAt = consumedAt;
        this.volumeMl = volumeMl;
        this.caffeineMg = caffeineMg;
        this.note = note;
    }

    public Long getId() { return id; }
}
