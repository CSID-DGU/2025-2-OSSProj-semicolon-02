package com.caffit.cafe.service;

import com.caffit.cafe.domain.Cafe;
import com.caffit.cafe.dto.CafeResponseDTO;
import com.caffit.cafe.infra.KakaoClient;
import com.caffit.cafe.infra.dto.KakaoPlacesResponse;
import com.caffit.cafe.repository.CafeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CafeService {

    private final CafeRepository cafeRepository; //반경 검색 ->거리 계산
    private final KakaoClient kakaoClient; // Kakao API 호출

    public List<CafeResponseDTO> findNearby(double lat, double lng, int radiusMeters) {
        // 실시간 카페 검색
        KakaoPlacesResponse kakaoResponse = kakaoClient.searchCafes(lat, lng, radiusMeters);
        
        // CafeResponseDTO로 변환
        List<CafeResponseDTO> kakaoCafes = kakaoResponse.documents().stream()
                .map(doc -> {
                    double cafeLat = Double.parseDouble(doc.y());
                    double cafeLng = Double.parseDouble(doc.x());
                    double distance = doc.distance() != null 
                            ? Double.parseDouble(doc.distance()) 
                            : GeoDistance.distance(lat, lng, cafeLat, cafeLng);
                    
                    return new CafeResponseDTO(
                            Long.parseLong(doc.id()), // Kakao place_id 사용
                            doc.placeName(),
                            doc.addressName(),
                            cafeLat,
                            cafeLng,
                            distance
                    );
                })
                .sorted(Comparator.comparingDouble(CafeResponseDTO::distance))
                .collect(Collectors.toList());

        // 필요하면 DB 데이터도 추가로 병합할 수 있음 (옵션)
        // List<Cafe> dbCafes = cafeRepository.findWithinRadius(lat, lng, radiusMeters);
      
        return kakaoCafes;
    }
}