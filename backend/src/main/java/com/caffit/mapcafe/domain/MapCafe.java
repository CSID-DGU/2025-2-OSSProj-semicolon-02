package com.caffit.mapcafe.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "map_cafe")
@Getter
@NoArgsConstructor
public class MapCafe {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private double lat;
    private double lng;
}
