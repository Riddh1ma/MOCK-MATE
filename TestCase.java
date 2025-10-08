package com.mockmate.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "test_cases")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestCase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;
    
    @NotBlank
    @Lob
    private String input;
    
    @NotBlank
    @Lob
    private String expectedOutput;
    
    private boolean isHidden = false; // Hidden test cases for evaluation
    
    private Integer points = 1;
    
    private String description;
    // inside TestCase class
    public String getInput() {
        return this.input; // adjust field name if different
    }

    public String getExpectedOutput() {
        return this.expectedOutput; // adjust field name if different
    }


    public TestCase(Question question, String input, String expectedOutput, boolean isHidden, Integer points) {
        this.question = question;
        this.input = input;
        this.expectedOutput = expectedOutput;
        this.isHidden = isHidden;
        this.points = points;
    }
}
