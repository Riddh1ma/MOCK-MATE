package com.mockmate.controller;

import com.mockmate.dto.CreateInterviewRequest;
import com.mockmate.dto.InterviewSessionDto;
import com.mockmate.model.InterviewSession;
import com.mockmate.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/interviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<InterviewSessionDto> createInterview(
            @Valid @RequestBody CreateInterviewRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        InterviewSession session = interviewService.createInterview(request, username);
        return ResponseEntity.ok(InterviewSessionDto.fromInterviewSession(session));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<List<InterviewSessionDto>> getUserInterviews(
            @RequestParam(required = false) InterviewSession.SessionStatus status,
            Authentication authentication) {
        String username = authentication.getName();
        List<InterviewSession> sessions = interviewService.getUserInterviews(username, status);
        List<InterviewSessionDto> dtos = sessions.stream()
                .map(InterviewSessionDto::fromInterviewSession)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<InterviewSessionDto> getInterview(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        InterviewSession session = interviewService.getInterview(id, username);
        return ResponseEntity.ok(InterviewSessionDto.fromInterviewSession(session));
    }

    @PutMapping("/{id}/start")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<InterviewSessionDto> startInterview(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        InterviewSession session = interviewService.startInterview(id, username);
        return ResponseEntity.ok(InterviewSessionDto.fromInterviewSession(session));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<InterviewSessionDto> completeInterview(
            @PathVariable Long id,
            @RequestBody Map<String, String> feedback,
            Authentication authentication) {
        String username = authentication.getName();
        InterviewSession session = interviewService.completeInterview(id, username, feedback.get("feedback"));
        return ResponseEntity.ok(InterviewSessionDto.fromInterviewSession(session));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<Map<String, String>> cancelInterview(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        interviewService.cancelInterview(id, username);
        return ResponseEntity.ok(Map.of("message", "Interview cancelled successfully"));
    }

    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<List<InterviewSessionDto>> getAvailablePeerInterviews() {
        List<InterviewSession> sessions = interviewService.getAvailablePeerInterviews();
        List<InterviewSessionDto> dtos = sessions.stream()
                .map(InterviewSessionDto::fromInterviewSession)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/{id}/join")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<InterviewSessionDto> joinPeerInterview(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        InterviewSession session = interviewService.joinPeerInterview(id, username);
        return ResponseEntity.ok(InterviewSessionDto.fromInterviewSession(session));
    }
}
