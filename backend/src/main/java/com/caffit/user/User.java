package com.caffit.user;

import jakarta.persistence.*;

@Entity
@Table(name = "users") // 테이블명을 users로 고정
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true, length=120)
    private String email;

    @Column(nullable=false, length=80)
    private String name;

    @Column(nullable=false, length=255)
    private String password; 

    protected User() {} // JPA 기본 생성자

    public User(String email, String name, String password) {
        this.email = email;
        this.name = name;
        this.password = password;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getPassword() { return password; }

    public void setName(String name) { this.name = name; }
    public void setPassword(String password) { this.password = password; }
}
