package com.caffit.cafe.controller;

import com.caffit.cafe.dto.CafeResponse;
import com.caffit.cafe.service.CafeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cafes")
@RequiredArgsConstructor
public class CafeController {

    private final CafeService cafeService;

    @GetMapping
    public List<CafeResponse> getNearbyCafes(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "1000") int radius
    ) {
        return cafeService.findNearby(lat, lng, radius);
    }
}