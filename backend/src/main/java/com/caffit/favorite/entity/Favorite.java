package com.caffit.favorite.entity;

import com.caffit.beverage.Beverage;
import com.caffit.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favorites")
public class Favorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "beverage_id")
    private Beverage beverage;

    @Column(length = 100, nullable = false)
    private String brand;

    @Column(length = 150, nullable = false)
    private String name;

    @Column(name = "caffeine_mg", nullable = false)
    private double caffeineMg;

    @Column(name = "volume_ml", nullable = false)
    private double volumeMl;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected Favorite() {}

    public Favorite(User user, Beverage beverage, String brand,
                    String name, double caffeineMg, double volumeMl) {
        this.user = user;
        this.beverage = beverage;
        this.brand = brand;
        this.name = name;
        this.caffeineMg = caffeineMg;
        this.volumeMl = volumeMl;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Beverage getBeverage() {
        return beverage;
    }

    public String getBrand() {
        return brand;
    }

    public String getName() {
        return name;
    }

    public double getCaffeineMg() {
        return caffeineMg;
    }

    public double getVolumeMl() {
        return volumeMl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
