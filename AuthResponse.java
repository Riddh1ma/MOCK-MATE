package com.mockmate.dto;

import com.mockmate.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String email;
    private User.Role role;
    private Long id;
    
    public AuthResponse(String token, String username, String email, User.Role role, Long id) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.role = role;
        this.id = id;
    }
}
