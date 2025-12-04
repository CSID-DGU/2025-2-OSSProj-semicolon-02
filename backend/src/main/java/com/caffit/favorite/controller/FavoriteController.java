package com.caffit.favorite.controller;

import com.caffit.beverage.Beverage;
import com.caffit.beverage.BeverageRepository;
import com.caffit.favorite.dto.FavoriteResponseDTO;
import com.caffit.favorite.entity.Favorite;
import com.caffit.favorite.repository.FavoriteRepository;
import com.caffit.user.User;
import com.caffit.user.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private record CreateReq(
        Long userId,
        Long beverageId,
        String brand,
        String name,
        double caffeineMg,
        double volumeMl
    ) {}

    private final FavoriteRepository favorites;
    private final UserRepository users;
    private final BeverageRepository beverages;

    public FavoriteController(FavoriteRepository favorites,
                               UserRepository users,
                               BeverageRepository beverages) {
        this.favorites = favorites;
        this.users = users;
        this.beverages = beverages;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<FavoriteResponseDTO> list(
            @RequestParam("userId") Long userId) {
        List<Favorite> list = favorites.findByUser_IdOrderByCreatedAtDesc(userId);
        return list.stream()
                .map(f -> new FavoriteResponseDTO(
                        f.getId(),
                        f.getUser().getId(),
                        f.getBeverage() != null ? f.getBeverage().getId() : null,
                        f.getBrand(),
                        f.getName(),
                        f.getCaffeineMg(),
                        f.getVolumeMl(),
                        f.getCreatedAt()
                ))
                .toList();
    }

    @PostMapping
    @Transactional
    public Long create(@RequestBody CreateReq req) {
        User user = users.findById(req.userId()).orElseThrow();
        Beverage beverage = req.beverageId() != null
                ? beverages.findById(req.beverageId()).orElse(null)
                : null;

        Favorite saved = favorites.save(
                new Favorite(user, beverage, req.brand(), req.name(),
                           req.caffeineMg(), req.volumeMl())
        );
        return saved.getId();
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void delete(@PathVariable Long id) {
        favorites.deleteById(id);
    }
}
