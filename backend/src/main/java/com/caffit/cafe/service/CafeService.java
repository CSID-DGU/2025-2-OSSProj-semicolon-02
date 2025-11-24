package com.caffit.cafe.service;

import com.caffit.cafe.domain.Cafe;
import com.caffit.cafe.dto.CafeResponseDTO;
import com.caffit.cafe.repository.CafeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CafeService {

    private final CafeRepository cafeRepository; //반경 검색 후 거리 계산ㅇ

    public List<CafeResponseDTO> findNearby(double lat, double lng, int radiusMeters) {
        List<Cafe> cafes = cafeRepository.findWithinRadius(lat, lng, radiusMeters);
        return cafes.stream()
                .map(cafe -> CafeResponseDTO.from(
                        cafe,
                        GeoDistance.distance(lat, lng, cafe.getLat(), cafe.getLng())
                ))
                .sorted(Comparator.comparingDouble(CafeResponseDTO::distance))
                .toList();
    }
}