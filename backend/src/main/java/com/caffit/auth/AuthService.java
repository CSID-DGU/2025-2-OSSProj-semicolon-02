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
        System.out.println("[AUTH] signUp start email=" + email);
        if (users.existsByEmail(email)) throw new IllegalStateException("이미 가입된 이메일입니다.");
        User saved = users.save(new User(email, name, rawPassword));
        System.out.println("[AUTH] saved id=" + saved.getId());
        return saved;
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
