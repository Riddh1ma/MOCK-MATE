package com.mockmate.controller;

import com.mockmate.dto.AuthRequest;
import com.mockmate.dto.AuthResponse;
import com.mockmate.dto.RegisterRequest;
import com.mockmate.model.User;
import com.mockmate.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = authService.register(registerRequest);
            String token = authService.generateToken(user.getUsername());
            
            AuthResponse response = new AuthResponse(
                token, 
                user.getUsername(), 
                user.getEmail(), 
                user.getRole(), 
                user.getId()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            String token = authService.authenticate(authRequest.getUsername(), authRequest.getPassword());
            User user = authService.getUserByUsername(authRequest.getUsername());
            
            AuthResponse response = new AuthResponse(
                token, 
                user.getUsername(), 
                user.getEmail(), 
                user.getRole(), 
                user.getId()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // JWT tokens are stateless, so logout is handled on the client side
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String username = authService.getUsernameFromToken(token);
                String newToken = authService.generateToken(username);
                
                return ResponseEntity.ok(Map.of("token", newToken));
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid token format"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
