package com.caffit.cafe.controller;

import com.caffit.cafe.dto.CafeResponseDTO;
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
    public List<CafeResponseDTO> getNearbyCafes(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "1000") int radius
    ) {
        System.out.println("📡 [Controller] 카페 검색 요청: lat=" + lat + ", lng=" + lng + ", radius=" + radius);
        List<CafeResponseDTO> result = cafeService.findNearby(lat, lng, radius);
        System.out.println("✅ [Controller] 카페 검색 결과: " + result.size() + "개");
        return result;
    }
}