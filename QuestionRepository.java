package com.mockmate.repository;

import com.mockmate.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    List<Question> findByTypeAndIsActiveTrue(Question.QuestionType type);
    
    List<Question> findByCategoryAndIsActiveTrue(Question.Category category);
    
    List<Question> findByDifficultyAndIsActiveTrue(Question.DifficultyLevel difficulty);
    
    List<Question> findByTypeAndDifficultyAndIsActiveTrue(Question.QuestionType type, Question.DifficultyLevel difficulty);
    
    List<Question> findByCategoryAndDifficultyAndIsActiveTrue(Question.Category category, Question.DifficultyLevel difficulty);
    
    @Query("SELECT q FROM Question q WHERE q.isActive = true AND q.category IN :categories ORDER BY RAND()")
    List<Question> findRandomQuestionsByCategories(@Param("categories") List<Question.Category> categories);
    
    @Query("SELECT q FROM Question q WHERE q.isActive = true AND q.difficulty = :difficulty AND q.type = :type ORDER BY RAND()")
    List<Question> findRandomQuestionsByDifficultyAndType(@Param("difficulty") Question.DifficultyLevel difficulty, 
                                                         @Param("type") Question.QuestionType type);
    
    @Query("SELECT q FROM Question q WHERE q.isActive = true AND q.tags LIKE %:tag%")
    List<Question> findByTag(@Param("tag") String tag);
    
    @Query("SELECT COUNT(q) FROM Question q WHERE q.type = :type AND q.isActive = true")
    Long countByType(@Param("type") Question.QuestionType type);
    
    @Query("SELECT COUNT(q) FROM Question q WHERE q.category = :category AND q.isActive = true")
    Long countByCategory(@Param("category") Question.Category category);
}
