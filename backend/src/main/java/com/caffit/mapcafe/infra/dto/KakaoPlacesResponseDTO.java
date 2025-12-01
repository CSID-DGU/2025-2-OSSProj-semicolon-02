// Kakao REST API가 주는 JSON 응답 그대로 담아

package com.caffit.mapcafe.infra.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record KakaoPlacesResponseDTO(
        Meta meta, // 요청 결과에 대한 요약 정보
        List<Document> documents
) {
    public record Meta(@JsonProperty("total_count") int totalCount) {}

    public record Document(
            String id,
            @JsonProperty("place_name") String placeName,
            @JsonProperty("address_name") String addressName,
            String x,
            String y,
            String distance
    ) {}
}
