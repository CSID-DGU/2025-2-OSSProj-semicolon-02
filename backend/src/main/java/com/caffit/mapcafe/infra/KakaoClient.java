//실제로 Kakao REST API를 호출하는 컴포넌트
//코드의 흐름ㅁ: 1. WebClient 준비 → 2. URL 만들기 → 3. API 호출 → 4. 응답 받기

package com.caffit.mapcafe.infra;

import com.caffit.mapcafe.infra.dto.KakaoPlacesResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor //생성자 주입
public class KakaoClient {

    private final WebClient kakaoWebClient;

    public KakaoPlacesResponseDTO searchCafes(double lat, double lng, int radiusMeters) {
        return kakaoWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v2/local/search/category.json")
                        .queryParam("category_group_code", "CE7") //카페" 코드 (정해진 거)
                        .queryParam("x", lng)
                        .queryParam("y", lat)
                        .queryParam("radius", radiusMeters)
                        .build())
                .retrieve()
                .bodyToMono(KakaoPlacesResponseDTO.class)
                .block();//결과 올때까지 기다리는 것임
    }
}
