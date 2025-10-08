package com.mockmate.service;

import com.mockmate.dto.RegisterRequest;
import com.mockmate.model.User;
import com.mockmate.repository.UserRepository;
import com.mockmate.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public User register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setPhone(registerRequest.getPhone());
        user.setBio(registerRequest.getBio());
        user.setRole(registerRequest.getRole());
        user.setEnabled(true);

        return userRepository.save(user);
    }

    public String authenticate(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        if (!user.isEnabled()) {
            throw new RuntimeException("Account is disabled");
        }

        return generateToken(username);
    }

    public String generateToken(String username) {
        return tokenProvider.generateTokenFromUsername(username);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String getUsernameFromToken(String token) {
        return tokenProvider.getUsernameFromJWT(token);
    }

    public boolean validateToken(String token) {
        return tokenProvider.validateToken(token);
    }
}
