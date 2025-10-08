package com.mockmate.dto;

import com.mockmate.model.User;
import lombok.Data;

@Data
public class UserProfileDto {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String bio;
    private String profileImageUrl;
    private User.Role role;
    private Integer totalInterviews;
    private Double averageScore;
    private Integer totalCodingProblems;
    private Double averageCodingScore;
    
    public static UserProfileDto fromUser(User user) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhone(user.getPhone());
        dto.setBio(user.getBio());
        dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setRole(user.getRole());
        dto.setTotalInterviews(user.getTotalInterviews());
        dto.setAverageScore(user.getAverageScore());
        dto.setTotalCodingProblems(user.getTotalCodingProblems());
        dto.setAverageCodingScore(user.getAverageCodingScore());
        return dto;
    }
}
