package com.mockmate.dto;

import com.mockmate.model.InterviewSession;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InterviewSessionDto {
    private Long id;
    private String title;
    private String description;
    private InterviewSession.InterviewType type;
    private InterviewSession.SessionStatus status;
    private Long userId;
    private String userName;
    private Long mentorId;
    private String mentorName;
    private LocalDateTime scheduledAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private Integer durationMinutes;
    private Double score;
    private String feedback;
    private Long peerUserId;
    private String peerUserName;
    private boolean isPeerInterview;
    
    public static InterviewSessionDto fromInterviewSession(InterviewSession session) {
        InterviewSessionDto dto = new InterviewSessionDto();
        dto.setId(session.getId());
        dto.setTitle(session.getTitle());
        dto.setDescription(session.getDescription());
        dto.setType(session.getType());
        dto.setStatus(session.getStatus());
        dto.setUserId(session.getUser().getId());
        dto.setUserName(session.getUser().getUsername());
        if (session.getMentor() != null) {
            dto.setMentorId(session.getMentor().getId());
            dto.setMentorName(session.getMentor().getUsername());
        }
        dto.setScheduledAt(session.getScheduledAt());
        dto.setStartedAt(session.getStartedAt());
        dto.setCompletedAt(session.getCompletedAt());
        dto.setDurationMinutes(session.getDurationMinutes());
        dto.setScore(session.getScore());
        dto.setFeedback(session.getFeedback());
        if (session.getPeerUser() != null) {
            dto.setPeerUserId(session.getPeerUser().getId());
            dto.setPeerUserName(session.getPeerUser().getUsername());
        }
        dto.setPeerInterview(session.isPeerInterview());
        return dto;
    }
}
