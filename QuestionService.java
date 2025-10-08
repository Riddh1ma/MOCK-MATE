package com.mockmate.service;

import com.mockmate.model.Question;
import com.mockmate.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final Random random = new Random();

    public List<Question> getQuestions(Question.QuestionType type, Question.Category category, 
                                     Question.DifficultyLevel difficulty, int limit) {
        if (type != null && difficulty != null) {
            return questionRepository.findByTypeAndDifficultyAndIsActiveTrue(type, difficulty)
                    .stream().limit(limit).toList();
        } else if (category != null && difficulty != null) {
            return questionRepository.findByCategoryAndDifficultyAndIsActiveTrue(category, difficulty)
                    .stream().limit(limit).toList();
        } else if (type != null) {
            return questionRepository.findByTypeAndIsActiveTrue(type)
                    .stream().limit(limit).toList();
        } else if (category != null) {
            return questionRepository.findByCategoryAndIsActiveTrue(category)
                    .stream().limit(limit).toList();
        } else if (difficulty != null) {
            return questionRepository.findByDifficultyAndIsActiveTrue(difficulty)
                    .stream().limit(limit).toList();
        }
        
        return questionRepository.findAll()
                .stream()
                .filter(Question::isActive)
                .limit(limit)
                .toList();
    }

    public Question getQuestion(Long id) {
        return questionRepository.findById(id)
                .filter(Question::isActive)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    public List<Question> getRandomQuestions(List<Question.Category> categories, 
                                           Question.DifficultyLevel difficulty,
                                           Question.QuestionType type, int count) {
        if (type != null && difficulty != null) {
            return questionRepository.findRandomQuestionsByDifficultyAndType(difficulty, type)
                    .stream().limit(count).toList();
        } else if (categories != null && !categories.isEmpty()) {
            return questionRepository.findRandomQuestionsByCategories(categories)
                    .stream().limit(count).toList();
        }
        
        // Fallback to random selection from all active questions
        List<Question> allQuestions = questionRepository.findAll()
                .stream()
                .filter(Question::isActive)
                .toList();
        
        return random.ints(0, allQuestions.size())
                .distinct()
                .limit(Math.min(count, allQuestions.size()))
                .mapToObj(allQuestions::get)
                .toList();
    }

    public List<Question> getCodingQuestions(Question.DifficultyLevel difficulty, 
                                           Question.Category category, int limit) {
        if (difficulty != null) {
            return questionRepository.findByTypeAndDifficultyAndIsActiveTrue(
                    Question.QuestionType.CODING, difficulty)
                    .stream().limit(limit).toList();
        } else if (category != null) {
            return questionRepository.findByCategoryAndIsActiveTrue(category)
                    .stream()
                    .filter(q -> q.getType() == Question.QuestionType.CODING)
                    .limit(limit)
                    .toList();
        }
        
        return questionRepository.findByTypeAndIsActiveTrue(Question.QuestionType.CODING)
                .stream().limit(limit).toList();
    }

    public List<Question> getMCQQuestions(Question.Category category, 
                                        Question.DifficultyLevel difficulty, int limit) {
        if (difficulty != null) {
            return questionRepository.findByTypeAndDifficultyAndIsActiveTrue(
                    Question.QuestionType.MCQ, difficulty)
                    .stream().limit(limit).toList();
        } else if (category != null) {
            return questionRepository.findByCategoryAndIsActiveTrue(category)
                    .stream()
                    .filter(q -> q.getType() == Question.QuestionType.MCQ)
                    .limit(limit)
                    .toList();
        }
        
        return questionRepository.findByTypeAndIsActiveTrue(Question.QuestionType.MCQ)
                .stream().limit(limit).toList();
    }

    public List<Question> getBehavioralQuestions(Question.Category category, int limit) {
        if (category != null) {
            return questionRepository.findByCategoryAndIsActiveTrue(category)
                    .stream()
                    .filter(q -> q.getType() == Question.QuestionType.BEHAVIORAL)
                    .limit(limit)
                    .toList();
        }
        
        return questionRepository.findByTypeAndIsActiveTrue(Question.QuestionType.BEHAVIORAL)
                .stream().limit(limit).toList();
    }
}
