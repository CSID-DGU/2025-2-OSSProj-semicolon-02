package com.caffit.mapcafe.service;

import com.caffit.mapcafe.domain.MapCafe;
import com.caffit.mapcafe.dto.MapCafeResponseDTO;
import com.caffit.mapcafe.infra.KakaoClient;
import com.caffit.mapcafe.infra.dto.KakaoPlacesResponseDTO;
import com.caffit.mapcafe.repository.MapCafeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MapCafeService {

    private final MapCafeRepository mapCafeRepository; //반경 검색 ->거리 계산
    private final KakaoClient kakaoClient; // Kakao API 호출

    public List<MapCafeResponseDTO> findNearby(double lat, double lng, int radiusMeters) {
        System.out.println("🔍 [Service] Kakao API 호출 시작: lat=" + lat + ", lng=" + lng + ", radius=" + radiusMeters);
        // 실시간 카페 검색
        KakaoPlacesResponseDTO kakaoResponse = kakaoClient.searchCafes(lat, lng, radiusMeters);
        System.out.println("📥 [Service] Kakao API 응답 받음: " + kakaoResponse.documents().size() + "개 카페");
        
        // MapCafeResponseDTO로 변환
        List<MapCafeResponseDTO> kakaoCafes = kakaoResponse.documents().stream()
                .map(doc -> {
                    double cafeLat = Double.parseDouble(doc.y());
                    double cafeLng = Double.parseDouble(doc.x());
                    double distance = doc.distance() != null 
                            ? Double.parseDouble(doc.distance()) 
                            : GeoDistance.distance(lat, lng, cafeLat, cafeLng);
                    
                    return new MapCafeResponseDTO(
                            Long.parseLong(doc.id()), // Kakao place_id 사용
                            doc.placeName(),
                            doc.addressName(),
                            cafeLat,
                            cafeLng,
                            distance
                    );
                })
                .sorted(Comparator.comparingDouble(MapCafeResponseDTO::distance))
                .collect(Collectors.toList());

        // 필요하면 DB 데이터도 추가로 병합할 수 있음 (옵션)
        // List<MapCafe> dbCafes = mapCafeRepository.findWithinRadius(lat, lng, radiusMeters);
      
        return kakaoCafes;
    }
}
