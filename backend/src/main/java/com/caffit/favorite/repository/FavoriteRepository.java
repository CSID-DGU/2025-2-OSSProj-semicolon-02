package com.caffit.favorite.repository;

import com.caffit.favorite.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser_IdOrderByCreatedAtDesc(Long userId);
    
    Optional<Favorite> findByUser_IdAndBeverage_Id(Long userId, Long beverageId);
    
    void deleteByUser_IdAndBeverage_Id(Long userId, Long beverageId);
}
