package com.mockmate.repository;

import com.mockmate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(User.Role role);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.enabled = true")
    List<User> findActiveUsersByRole(@Param("role") User.Role role);
    
    @Query("SELECT u FROM User u WHERE u.averageScore >= :minScore ORDER BY u.averageScore DESC")
    List<User> findTopPerformers(@Param("minScore") Double minScore);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    Long countByRole(@Param("role") User.Role role);
    
    @Query("SELECT AVG(u.averageScore) FROM User u WHERE u.role = :role AND u.averageScore > 0")
    Double getAverageScoreByRole(@Param("role") User.Role role);
}
