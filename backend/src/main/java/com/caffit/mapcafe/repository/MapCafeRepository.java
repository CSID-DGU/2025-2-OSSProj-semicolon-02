package com.caffit.mapcafe.repository;

import com.caffit.mapcafe.domain.MapCafe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MapCafeRepository extends JpaRepository<MapCafe, Long>, MapCafeRepositoryCustom {
}
