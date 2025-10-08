package com.mockmate.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "question_responses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {
    
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
    
    private String selectedOption; // For MCQ questions
    
    @Lob
    private String textResponse; // For open-ended questions
    
    private Double score;
    
    private boolean isCorrect = false;
    
    private Integer timeSpentSeconds;
    
    @Column(name = "answered_at")
    private LocalDateTime answeredAt = LocalDateTime.now();
    
    public QuestionResponse(User user, Question question, InterviewSession interviewSession, String selectedOption, Double score, boolean isCorrect) {
        this.user = user;
        this.question = question;
        this.interviewSession = interviewSession;
        this.selectedOption = selectedOption;
        this.score = score;
        this.isCorrect = isCorrect;
    }
}
