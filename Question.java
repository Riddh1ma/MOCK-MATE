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
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 2000)
    private String title;
    
    @NotBlank
    @Size(max = 5000)
    private String content;
    
    @Enumerated(EnumType.STRING)
    private QuestionType type;
    
    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficulty;
    
    @Enumerated(EnumType.STRING)
    private Category category;
    
    @Size(max = 100)
    private String tags; // Comma-separated tags
    
    @Size(max = 500)
    private String expectedAnswer;
    
    @Column(name = "time_limit_minutes")
    private Integer timeLimitMinutes;
    
    private Integer points = 10;
    
    private boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // For coding questions
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<TestCase> testCases;
    
    // For MCQ questions
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Option> options;
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<QuestionResponse> responses;
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    public enum QuestionType {
        MCQ, CODING, BEHAVIORAL, TECHNICAL
    }
    
    public enum DifficultyLevel {
        EASY, MEDIUM, HARD
    }
    
    public enum Category {
        JAVA, PYTHON, CPP, DATA_STRUCTURES, ALGORITHMS, SYSTEM_DESIGN,
        DATABASE, NETWORKING, BEHAVIORAL, LEADERSHIP, PROBLEM_SOLVING
    }
}
