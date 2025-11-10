// com.caffit.beverage.BeverageRepository.java
package com.caffit.beverage;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BeverageRepository extends JpaRepository<Beverage, Long> { }
