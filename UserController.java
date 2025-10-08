package com.mockmate.controller;

import com.mockmate.dto.UserProfileDto;
import com.mockmate.model.User;
import com.mockmate.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<UserProfileDto> getCurrentUserProfile(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(UserProfileDto.fromUser(user));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<UserProfileDto> updateProfile(
            @RequestBody UserProfileDto profileDto,
            Authentication authentication) {
        String username = authentication.getName();
        User updatedUser = userService.updateProfile(username, profileDto);
        return ResponseEntity.ok(UserProfileDto.fromUser(updatedUser));
    }

    @PostMapping("/profile/upload-image")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        String username = authentication.getName();
        String imageUrl = userService.uploadProfileImage(username, file);
        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }

    @GetMapping("/mentors")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<List<UserProfileDto>> getAvailableMentors() {
        List<User> mentors = userService.getAvailableMentors();
        List<UserProfileDto> mentorDtos = mentors.stream()
                .map(UserProfileDto::fromUser)
                .toList();
        return ResponseEntity.ok(mentorDtos);
    }

    @GetMapping("/leaderboard")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<List<UserProfileDto>> getLeaderboard(
            @RequestParam(defaultValue = "10") int limit) {
        List<User> topUsers = userService.getTopPerformers(limit);
        List<UserProfileDto> userDtos = topUsers.stream()
                .map(UserProfileDto::fromUser)
                .toList();
        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getUserStats(Authentication authentication) {
        String username = authentication.getName();
        Map<String, Object> stats = userService.getUserStats(username);
        return ResponseEntity.ok(stats);
    }
}
