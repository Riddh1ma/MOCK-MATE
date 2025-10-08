package com.mockmate.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "options")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Option {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;
    
    @NotBlank
    @Size(max = 1000)
    private String text;
    
    private boolean isCorrect = false;
    
    private String optionLabel; // A, B, C, D
    
    public Option(Question question, String text, boolean isCorrect, String optionLabel) {
        this.question = question;
        this.text = text;
        this.isCorrect = isCorrect;
        this.optionLabel = optionLabel;
    }
}
