//실제로 Kakao REST API를 호출하는 컴포넌트
//코드의 흐름ㅁ: 1. WebClient 준비 → 2. URL 만들기 → 3. API 호출 → 4. 응답 받기

package com.caffit.mapcafe.infra;

import com.caffit.mapcafe.infra.dto.KakaoPlacesResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Slf4j
@Component
@RequiredArgsConstructor //생성자 주입
public class KakaoClient {

    private final WebClient kakaoWebClient;

    public KakaoPlacesResponseDTO searchCafes(double lat, double lng, int radiusMeters) {
        try {
            log.info("🔍 [KakaoClient] Kakao API 호출 시작: lat={}, lng={}, radius={}", lat, lng, radiusMeters);
            KakaoPlacesResponseDTO response = kakaoWebClient.get()
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
            log.info(" [KakaoClient] Kakao API 호출 성공: {}개 카페", response.documents().size());
            return response;
        } catch (WebClientResponseException e) {
            log.error("❌ [KakaoClient] Kakao API 호출 실패: status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Kakao API 호출 실패: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("❌ [KakaoClient] 예상치 못한 에러 발생", e);
            throw new RuntimeException("카페 검색 중 오류 발생: " + e.getMessage(), e);
        }
    }
}
