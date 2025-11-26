package com.caffit.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")              // 프론트에서 호출할 API 경로 패턴
                .allowedOrigins(
                        "http://localhost:8081",    // 웹(개발)에서 쓸 때 예시(확실하지 않음)
                        "http://10.0.2.2:8081",     // 안드 에뮬레이터에서 웹 서버 띄울 때 예시(확실하지 않음)
                        "http://localhost",         // iOS 시뮬레이터에서 RN 디버거(확실하지 않음)
                        "http://10.0.2.2",          // Android 에뮬레이터에서 RN 디버거(확실)
                        "exp://*", "http://*", "https://*" // Expo 등 개발 편의(확실하지 않음)
                )
                .allowedMethods("GET","POST","PUT","PATCH","DELETE","OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);
    }
}
