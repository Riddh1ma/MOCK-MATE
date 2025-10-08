package com.mockmate.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "interview_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 200)
    private String title;
    
    @Size(max = 1000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    private InterviewType type;
    
    @Enumerated(EnumType.STRING)
    private SessionStatus status = SessionStatus.SCHEDULED;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id")
    private User mentor;
    
    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;
    
    @Column(name = "started_at")
    private LocalDateTime startedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes = 60;
    
    private Double score;
    
    @Size(max = 2000)
    private String feedback;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // For peer interviews
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "peer_user_id")
    private User peerUser;
    
    private boolean isPeerInterview = false;
    
    @OneToMany(mappedBy = "interviewSession", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<QuestionResponse> questionResponses;
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    public enum InterviewType {
        TECHNICAL, BEHAVIORAL, CODING, MIXED
    }
    
    public enum SessionStatus {
        SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, EXPIRED
    }
}
