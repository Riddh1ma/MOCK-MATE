package com.mockmate.service;

import com.mockmate.dto.UserProfileDto;
import com.mockmate.model.User;
import com.mockmate.repository.CodingSubmissionRepository;
import com.mockmate.repository.InterviewSessionRepository;
import com.mockmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final InterviewSessionRepository interviewSessionRepository;
    private final CodingSubmissionRepository codingSubmissionRepository;

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public User updateProfile(String username, UserProfileDto profileDto) {
        User user = getUserByUsername(username);
        
        if (profileDto.getFirstName() != null) {
            user.setFirstName(profileDto.getFirstName());
        }
        if (profileDto.getLastName() != null) {
            user.setLastName(profileDto.getLastName());
        }
        if (profileDto.getPhone() != null) {
            user.setPhone(profileDto.getPhone());
        }
        if (profileDto.getBio() != null) {
            user.setBio(profileDto.getBio());
        }
        if (profileDto.getProfileImageUrl() != null) {
            user.setProfileImageUrl(profileDto.getProfileImageUrl());
        }
        
        return userRepository.save(user);
    }

    public String uploadProfileImage(String username, MultipartFile file) {
        // TODO: Implement file upload to cloud storage (AWS S3, Google Cloud Storage, etc.)
        // For now, return a placeholder URL
        User user = getUserByUsername(username);
        String imageUrl = "/uploads/profile-images/" + username + "_" + System.currentTimeMillis();
        user.setProfileImageUrl(imageUrl);
        userRepository.save(user);
        return imageUrl;
    }

    public List<User> getAvailableMentors() {
        return userRepository.findActiveUsersByRole(User.Role.MENTOR);
    }

    public List<User> getTopPerformers(int limit) {
        List<User> users = userRepository.findTopPerformers(0.0);
        return users.stream()
                .limit(limit)
                .toList();
    }

    public Map<String, Object> getUserStats(String username) {
        User user = getUserByUsername(username);
        Map<String, Object> stats = new HashMap<>();
        
        // Interview stats
        long totalInterviews = interviewSessionRepository.countByUserAndStatus(user, 
                com.mockmate.model.InterviewSession.SessionStatus.COMPLETED);
        Double averageScore = interviewSessionRepository.getAverageScoreByUser(user);
        
        // Coding stats
        long totalCodingSubmissions = codingSubmissionRepository.countByUserAndStatus(user,
                com.mockmate.model.CodingSubmission.SubmissionStatus.COMPLETED);
        Double averageCodingScore = codingSubmissionRepository.getAverageScoreByUser(user);
        
        stats.put("totalInterviews", totalInterviews);
        stats.put("averageScore", averageScore != null ? averageScore : 0.0);
        stats.put("totalCodingSubmissions", totalCodingSubmissions);
        stats.put("averageCodingScore", averageCodingScore != null ? averageCodingScore : 0.0);
        stats.put("rank", getRank(user));
        
        return stats;
    }

    private Integer getRank(User user) {
        List<User> topPerformers = userRepository.findTopPerformers(0.0);
        for (int i = 0; i < topPerformers.size(); i++) {
            if (topPerformers.get(i).getId().equals(user.getId())) {
                return i + 1;
            }
        }
        return topPerformers.size() + 1;
    }
}
