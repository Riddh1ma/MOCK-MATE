package com.mockmate.repository;

import com.mockmate.model.CodingSubmission;
import com.mockmate.model.User;
import com.mockmate.model.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CodingSubmissionRepository extends JpaRepository<CodingSubmission, Long> {
    
    List<CodingSubmission> findByUser(User user);
    
    List<CodingSubmission> findByUserAndStatus(User user, CodingSubmission.SubmissionStatus status);
    
    List<CodingSubmission> findByInterviewSession(InterviewSession interviewSession);
    
    @Query("SELECT c FROM CodingSubmission c WHERE c.user = :user AND c.submittedAt BETWEEN :startDate AND :endDate")
    List<CodingSubmission> findByUserAndDateRange(@Param("user") User user, 
                                                 @Param("startDate") LocalDateTime startDate, 
                                                 @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT AVG(c.score) FROM CodingSubmission c WHERE c.user = :user AND c.score IS NOT NULL")
    Double getAverageScoreByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(c) FROM CodingSubmission c WHERE c.user = :user AND c.status = :status")
    Long countByUserAndStatus(@Param("user") User user, @Param("status") CodingSubmission.SubmissionStatus status);
    
    @Query("SELECT c FROM CodingSubmission c WHERE c.language = :language AND c.status = :status ORDER BY c.submittedAt DESC")
    List<CodingSubmission> findRecentSubmissionsByLanguage(@Param("language") CodingSubmission.ProgrammingLanguage language, 
                                                          @Param("status") CodingSubmission.SubmissionStatus status);
}
