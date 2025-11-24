package com.caffit.cafe.repository;

import com.caffit.cafe.domain.Cafe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CafeRepository extends JpaRepository<Cafe, Long>, CafeRepositoryCustom {
}