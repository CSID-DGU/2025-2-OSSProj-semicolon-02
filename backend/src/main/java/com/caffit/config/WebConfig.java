// com.caffit.config.WebConfig.java
package com.caffit.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")   // 개발용. 배포 시 RN 패키저/도메인으로 제한
                .allowedMethods("GET","POST","PUT","DELETE","PATCH","OPTIONS");
    }
}
