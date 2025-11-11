// com.caffit.auth.AuthController.java
package com.caffit.auth;

import com.caffit.user.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private record SignUpReq(@Email String email, @NotBlank String name, @NotBlank String password) {}
    private record LoginReq(@Email String email, @NotBlank String password) {}
    private record UserRes(Long id, String email, String name) {
        static UserRes from(User u) { return new UserRes(u.getId(), u.getEmail(), u.getName()); }
    }

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/signup")
    public UserRes signUp(@RequestBody SignUpReq req) {
        System.out.println("[AUTH] /signup " + req.email()); // 진입 확인
        return UserRes.from(auth.signUp(req.email(), req.name(), req.password()));
    }

    @PostMapping("/login")
    public UserRes login(@RequestBody LoginReq req) {
        return UserRes.from(auth.login(req.email(), req.password()));
    }
}
