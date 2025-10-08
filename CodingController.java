package com.mockmate.controller;

import com.mockmate.dto.CodingSubmissionDto;
import com.mockmate.dto.SubmitCodeRequest;
import com.mockmate.service.CodingEvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/coding")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CodingController {

    private final CodingEvaluationService codingEvaluationService;

    @PostMapping("/submit")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<CodingSubmissionDto> submitCode(
            @Valid @RequestBody SubmitCodeRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        var submission = codingEvaluationService.submitCode(request, username);
        return ResponseEntity.ok(CodingSubmissionDto.fromCodingSubmission(submission));
    }

    @GetMapping("/submissions")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<List<CodingSubmissionDto>> getUserSubmissions(
            @RequestParam(required = false) Long questionId,
            @RequestParam(required = false) Long interviewSessionId,
            Authentication authentication) {
        String username = authentication.getName();
        var submissions = codingEvaluationService.getUserSubmissions(username, questionId, interviewSessionId);
        List<CodingSubmissionDto> dtos = submissions.stream()
                .map(CodingSubmissionDto::fromCodingSubmission)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/submissions/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<CodingSubmissionDto> getSubmission(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        var submission = codingEvaluationService.getSubmission(id, username);
        return ResponseEntity.ok(CodingSubmissionDto.fromCodingSubmission(submission));
    }

    @PostMapping("/test")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> testCode(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        String code = request.get("code");
        String language = request.get("language");
        String input = request.get("input");
        
        Map<String, Object> result = codingEvaluationService.testCode(code, language, input);
        return ResponseEntity.ok(result);
    }
}
