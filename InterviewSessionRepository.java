package com.mockmate.repository;

import com.mockmate.model.InterviewSession;
import com.mockmate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
    
    List<InterviewSession> findByUser(User user);
    
    List<InterviewSession> findByMentor(User mentor);
    
    List<InterviewSession> findByUserAndStatus(User user, InterviewSession.SessionStatus status);
    
    List<InterviewSession> findByStatus(InterviewSession.SessionStatus status);
    
    List<InterviewSession> findByTypeAndStatus(InterviewSession.InterviewType type, InterviewSession.SessionStatus status);
    
    @Query("SELECT i FROM InterviewSession i WHERE i.user = :user AND i.scheduledAt BETWEEN :startDate AND :endDate")
    List<InterviewSession> findByUserAndDateRange(@Param("user") User user, 
                                                 @Param("startDate") LocalDateTime startDate, 
                                                 @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT i FROM InterviewSession i WHERE i.scheduledAt BETWEEN :startDate AND :endDate AND i.status = :status")
    List<InterviewSession> findUpcomingInterviews(@Param("startDate") LocalDateTime startDate, 
                                                 @Param("endDate") LocalDateTime endDate, 
                                                 @Param("status") InterviewSession.SessionStatus status);
    
    @Query("SELECT COUNT(i) FROM InterviewSession i WHERE i.user = :user AND i.status = :status")
    Long countByUserAndStatus(@Param("user") User user, @Param("status") InterviewSession.SessionStatus status);
    
    @Query("SELECT AVG(i.score) FROM InterviewSession i WHERE i.user = :user AND i.score IS NOT NULL")
    Double getAverageScoreByUser(@Param("user") User user);
    
    @Query("SELECT i FROM InterviewSession i WHERE i.isPeerInterview = true AND i.status = :status")
    List<InterviewSession> findPeerInterviewSessions(@Param("status") InterviewSession.SessionStatus status);
}
