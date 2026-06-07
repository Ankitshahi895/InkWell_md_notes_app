package com.ankit.markdownnotes.controller;

import com.ankit.markdownnotes.dto.auth.AuthResponse;
import com.ankit.markdownnotes.dto.auth.LoginRequest;
import com.ankit.markdownnotes.dto.auth.RegisterRequest;
import com.ankit.markdownnotes.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public String register(
            @RequestBody RegisterRequest request) {

        authService.register(request);

        return "User Registered Successfully";
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request) {

        String token =
                authService.login(request);

        return new AuthResponse(token);
    }
}