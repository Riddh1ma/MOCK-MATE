package com.mockmate.dto;

import com.mockmate.model.InterviewSession;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateInterviewRequest {
    
    @NotBlank
    private String title;
    
    private String description;
    
    @NotNull
    private InterviewSession.InterviewType type;
    
    @Future
    @NotNull
    private LocalDateTime scheduledAt;
    
    private Integer durationMinutes = 60;
    
    private Long mentorId; // Optional for mentor assignment
    
    private Long peerUserId; // For peer interviews
    
    private boolean isPeerInterview = false;
}
