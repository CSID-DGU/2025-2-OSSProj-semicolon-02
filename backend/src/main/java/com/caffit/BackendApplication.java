package com.caffit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        // .env 파일 로드 (backend 폴더의 .env 파일)
        // Spring Boot가 시작되기 전에 .env 파일을 읽어서 System Property로 설정
        // 그러면 application.yml의 ${DB_URL} 같은 플레이스홀더가 자동으로 .env 값으로 치환됨
        try {
            // .env 파일 경로 찾기 (프로젝트 루트 또는 backend 폴더)
            String userDir = System.getProperty("user.dir");
            System.out.println("========================================");
            System.out.println("현재 작업 디렉토리: " + userDir);
            
            java.io.File envFile = new java.io.File(userDir, ".env");
            System.out.println(".env 파일 경로: " + envFile.getAbsolutePath());
            System.out.println(".env 파일 존재 여부: " + envFile.exists());
            
            int loadedCount = 0;
            
            if (!envFile.exists()) {
                System.out.println("⚠️ .env 파일이 없습니다. 시스템 환경 변수를 사용합니다.");
            } else {
                // .env 파일을 직접 읽어서 파싱 (시스템 환경 변수 무시)
                java.util.List<String> lines = java.nio.file.Files.readAllLines(envFile.toPath(), java.nio.charset.StandardCharsets.UTF_8);
                
                for (String line : lines) {
                    line = line.trim();
                    // 주석이나 빈 줄 건너뛰기
                    if (line.isEmpty() || line.startsWith("#")) {
                        continue;
                    }
                    
                    // KEY=VALUE 형식 파싱
                    int equalsIndex = line.indexOf('=');
                    if (equalsIndex > 0) {
                        String key = line.substring(0, equalsIndex).trim();
                        String value = line.substring(equalsIndex + 1).trim();
                        
                        // 따옴표 제거 (있는 경우)
                        if ((value.startsWith("\"") && value.endsWith("\"")) || 
                            (value.startsWith("'") && value.endsWith("'"))) {
                            value = value.substring(1, value.length() - 1);
                        }
                        
                        // System Property로 설정 (기존 값 덮어쓰기)
                        System.setProperty(key, value);
                        loadedCount++;
                    }
                }
                
                System.out.println("✅ .env 파일을 직접 읽어서 로드했습니다. (총 " + loadedCount + "개 변수)");
            }
            
            // DB 관련 변수 상세 확인
            String dbUrl = System.getProperty("DB_URL");
            String dbUser = System.getProperty("DB_USER");
            String dbPassword = System.getProperty("DB_PASSWORD");
            String kakaoKey = System.getProperty("KAKAO_REST_API_KEY");
            
            System.out.println("   - DB_URL: " + (dbUrl != null ? "설정됨 (" + dbUrl.substring(0, Math.min(50, dbUrl.length())) + "...)" : "없음"));
            System.out.println("   - DB_USER: " + (dbUser != null ? "설정됨 (" + dbUser + ")" : "없음"));
            System.out.println("   - DB_PASSWORD: " + (dbPassword != null ? "설정됨 (길이: " + dbPassword.length() + ", 첫 글자: " + (dbPassword.length() > 0 ? dbPassword.charAt(0) : "없음") + ", 마지막 글자: " + (dbPassword.length() > 0 ? dbPassword.charAt(dbPassword.length() - 1) : "없음") + ")" : "없음"));
            System.out.println("   - KAKAO_REST_API_KEY: " + (kakaoKey != null ? "설정됨 (길이: " + kakaoKey.length() + ")" : "없음"));
            
            // DB_PASSWORD 값 확인 (보안을 위해 일부만 표시)
            if (dbPassword != null) {
                System.out.println("   - DB_PASSWORD 값 확인: " + (dbPassword.length() > 4 ? dbPassword.substring(0, 4) + "..." + dbPassword.substring(dbPassword.length() - 1) : "***"));
            }
            
            System.out.println("========================================");
        } catch (Exception e) {
            System.out.println("========================================");
            System.out.println("⚠️ .env 파일을 찾을 수 없습니다. 시스템 환경 변수를 사용합니다.");
            System.out.println("   에러: " + e.getMessage());
            e.printStackTrace();
            System.out.println("========================================");
        }
        
        SpringApplication.run(BackendApplication.class, args);
    }
}
