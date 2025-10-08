package com.mockmate.controller;

import com.mockmate.dto.QuestionDto;
import com.mockmate.model.Question;
import com.mockmate.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<List<QuestionDto>> getQuestions(
            @RequestParam(required = false) Question.QuestionType type,
            @RequestParam(required = false) Question.Category category,
            @RequestParam(required = false) Question.DifficultyLevel difficulty,
            @RequestParam(defaultValue = "10") int limit) {
        List<Question> questions = questionService.getQuestions(type, category, difficulty, limit);
        List<QuestionDto> dtos = questions.stream()
                .map(QuestionDto::fromQuestion)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<QuestionDto> getQuestion(@PathVariable Long id) {
        Question question = questionService.getQuestion(id);
        return ResponseEntity.ok(QuestionDto.fromQuestion(question));
    }

    @GetMapping("/random")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<List<QuestionDto>> getRandomQuestions(
            @RequestParam(required = false) List<Question.Category> categories,
            @RequestParam(required = false) Question.DifficultyLevel difficulty,
            @RequestParam(required = false) Question.QuestionType type,
            @RequestParam(defaultValue = "5") int count) {
        List<Question> questions = questionService.getRandomQuestions(categories, difficulty, type, count);
        List<QuestionDto> dtos = questions.stream()
                .map(QuestionDto::fromQuestion)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/coding")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<List<QuestionDto>> getCodingQuestions(
            @RequestParam(required = false) Question.DifficultyLevel difficulty,
            @RequestParam(required = false) Question.Category category,
            @RequestParam(defaultValue = "10") int limit) {
        List<Question> questions = questionService.getCodingQuestions(difficulty, category, limit);
        List<QuestionDto> dtos = questions.stream()
                .map(QuestionDto::fromQuestion)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/mcq")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<List<QuestionDto>> getMCQQuestions(
            @RequestParam(required = false) Question.Category category,
            @RequestParam(required = false) Question.DifficultyLevel difficulty,
            @RequestParam(defaultValue = "10") int limit) {
        List<Question> questions = questionService.getMCQQuestions(category, difficulty, limit);
        List<QuestionDto> dtos = questions.stream()
                .map(QuestionDto::fromQuestion)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/behavioral")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<List<QuestionDto>> getBehavioralQuestions(
            @RequestParam(required = false) Question.Category category,
            @RequestParam(defaultValue = "10") int limit) {
        List<Question> questions = questionService.getBehavioralQuestions(category, limit);
        List<QuestionDto> dtos = questions.stream()
                .map(QuestionDto::fromQuestion)
                .toList();
        return ResponseEntity.ok(dtos);
    }
}
