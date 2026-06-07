package com.ankit.markdownnotes.service;

import com.ankit.markdownnotes.security.JwtService;
import com.ankit.markdownnotes.dto.auth.LoginRequest;
import com.ankit.markdownnotes.dto.auth.RegisterRequest;
import com.ankit.markdownnotes.entity.User;
import com.ankit.markdownnotes.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public void register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role("USER")
                .build();

        userRepository.save(user);
    }

    public String login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        boolean matches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword());

        if (!matches) {
            throw new RuntimeException(
                    "Invalid credentials");
        }

        return jwtService.generateToken(
                user.getEmail());
    }
}