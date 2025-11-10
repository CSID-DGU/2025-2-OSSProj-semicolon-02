// com.caffit.auth.AuthService.java
package com.caffit.auth;

import com.caffit.user.User;
import com.caffit.user.UserRepository;
import java.util.NoSuchElementException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository users;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository users) {
        this.users = users;
    }

    public User signUp(String email, String name, String rawPassword) {
        if (users.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 등록된 이메일입니다.");
        }
        String hash = encoder.encode(rawPassword);
        return users.save(new User(email, name, hash));
    }

    public User login(String email, String rawPassword) {
        User u = users.findByEmail(email).orElseThrow(() -> new NoSuchElementException("가입 정보가 없습니다."));
        if (!encoder.matches(rawPassword, u.getPasswordHash())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        return u; // 실제 서비스에서는 토큰 발급 등으로 확장
    }
}
