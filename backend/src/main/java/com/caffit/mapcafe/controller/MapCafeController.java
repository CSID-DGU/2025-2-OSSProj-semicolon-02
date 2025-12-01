package com.caffit.mapcafe.controller;

import com.caffit.mapcafe.dto.MapCafeResponseDTO;
import com.caffit.mapcafe.service.MapCafeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cafes")
@RequiredArgsConstructor
public class MapCafeController {

    private final MapCafeService mapCafeService;

    @GetMapping
    public List<MapCafeResponseDTO> getNearbyCafes(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "1000") int radius
    ) {
        System.out.println("📡 [Controller] 카페 검색 요청: lat=" + lat + ", lng=" + lng + ", radius=" + radius);
        List<MapCafeResponseDTO> result = mapCafeService.findNearby(lat, lng, radius);
        System.out.println("✅ [Controller] 카페 검색 결과: " + result.size() + "개");
        return result;
    }
}
