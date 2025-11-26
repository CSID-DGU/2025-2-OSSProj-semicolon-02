// com.caffit.beverage.Beverage.java
package com.caffit.beverage;

import jakarta.persistence.*;

@Entity
@Table(name = "beverages")
public class Beverage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "beverage_id")
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "caffeine_mg_per_serv", nullable = false)
    private double caffeineMgPerServing;

    @Column(name = "serving_ml", nullable = false)
    private double servingMl;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    protected Beverage() {}

    public Beverage(String name, double caffeineMgPerServing, double servingMl) {
        this.name = name;
        this.caffeineMgPerServing = caffeineMgPerServing;
        this.servingMl = servingMl;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
}
