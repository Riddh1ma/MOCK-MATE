package com.mockmate.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "behavioral_responses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BehavioralResponse {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_session_id")
    private InterviewSession interviewSession;
    
    @NotBlank
    @Lob
    private String response;
    
    private String audioUrl; // URL to recorded audio response
    
    private String transcript; // AI-generated transcript
    
    // AI Analysis Results
    private Double sentimentScore; // -1.0 to 1.0
    private String sentimentLabel; // POSITIVE, NEGATIVE, NEUTRAL
    private Double confidenceScore; // 0.0 to 1.0
    
    @Size(max = 1000)
    private String contentAnalysis; // AI analysis of content quality
    
    @Size(max = 1000)
    private String toneAnalysis; // AI analysis of tone and delivery
    
    @Size(max = 2000)
    private String improvementSuggestions; // AI-generated suggestions
    
    private Double overallScore; // Overall score based on AI analysis
    
    private Integer responseTimeSeconds;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt = LocalDateTime.now();
    
    @Column(name = "analyzed_at")
    private LocalDateTime analyzedAt;
    
    // Manual review fields
    private Double mentorScore;
    
    @Size(max = 1000)
    private String mentorFeedback;
    
    private boolean isReviewedByMentor = false;
}
