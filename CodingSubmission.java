package com.mockmate.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "coding_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodingSubmission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Setter
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Setter
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;
    
    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_session_id")
    private InterviewSession interviewSession;
    
    @Setter
    @NotBlank
    @Lob
    private String code;
    
    @Setter
    @Enumerated(EnumType.STRING)
    private ProgrammingLanguage language;
    
    @Setter
    @Enumerated(EnumType.STRING)
    private SubmissionStatus status = SubmissionStatus.PENDING;
    
    private Double score;
    
    private Integer executionTimeMs;
    
    private Integer memoryUsageKb;
    
    @Size(max = 1000)
    private String compilationError;
    
    @Setter
    @Size(max = 1000)
    private String runtimeError;
    
    @Setter
    @Size(max = 2000)
    private String feedback;
    
    private Integer testCasesPassed;
    
    private Integer totalTestCases;
    
    @Setter
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt = LocalDateTime.now();
    
    @Setter
    @Column(name = "evaluated_at")
    private LocalDateTime evaluatedAt;

    public void setScore(double score) { this.score = score; }
    public void setTestCasesPassed(int passed) { this.testCasesPassed = passed; }
    public void setTotalTestCases(int total) { this.totalTestCases = total; }


    public enum ProgrammingLanguage {
        JAVA, PYTHON, CPP, JAVASCRIPT
    }
    
    public enum SubmissionStatus {
        PENDING, COMPILING, RUNNING, COMPLETED, FAILED, TIMEOUT
    }
}
