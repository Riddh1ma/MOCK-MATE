package com.mockmate.dto;

import com.mockmate.model.Question;
import lombok.Data;

import java.util.List;

@Data
public class QuestionDto {
    private Long id;
    private String title;
    private String content;
    private Question.QuestionType type;
    private Question.DifficultyLevel difficulty;
    private Question.Category category;
    private String tags;
    private String expectedAnswer;
    private Integer timeLimitMinutes;
    private Integer points;
    private List<OptionDto> options; // For MCQ questions
    private List<TestCaseDto> testCases; // For coding questions
    
    public static QuestionDto fromQuestion(Question question) {
        QuestionDto dto = new QuestionDto();
        dto.setId(question.getId());
        dto.setTitle(question.getTitle());
        dto.setContent(question.getContent());
        dto.setType(question.getType());
        dto.setDifficulty(question.getDifficulty());
        dto.setCategory(question.getCategory());
        dto.setTags(question.getTags());
        dto.setExpectedAnswer(question.getExpectedAnswer());
        dto.setTimeLimitMinutes(question.getTimeLimitMinutes());
        dto.setPoints(question.getPoints());
        
        if (question.getOptions() != null) {
            dto.setOptions(question.getOptions().stream()
                    .map(OptionDto::fromOption)
                    .toList());
        }
        
        if (question.getTestCases() != null) {
            dto.setTestCases(question.getTestCases().stream()
                    .map(TestCaseDto::fromTestCase)
                    .toList());
        }
        
        return dto;
    }
}
