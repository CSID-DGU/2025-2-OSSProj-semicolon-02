// com.caffit.auth.AuthService.java
package com.caffit.auth;

import com.caffit.user.User;
import com.caffit.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {
    private final UserRepository users;

    public AuthService(UserRepository users) { this.users = users; }

    public User signUp(String email, String name, String rawPassword) {
        if (users.existsByEmail(email)) {
            throw new IllegalStateException("이미 가입된 이메일입니다.");
        }
        // TODO: 비밀번호는 반드시 해시(BCrypt)로 변경 권장
        User u = new User(email, name, rawPassword);
        return users.save(u); // 최초 save 시 user 테이블이 자동 생성됨(ddl-auto=update일 때)
    }

    public User login(String email, String rawPassword) {
        User u = users.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("가입 정보를 찾을 수 없습니다."));
        if (!u.getPassword().equals(rawPassword)) {
            throw new IllegalArgumentException("비밀번호가 올바르지 않습니다.");
        }
        return u;
    }
}
