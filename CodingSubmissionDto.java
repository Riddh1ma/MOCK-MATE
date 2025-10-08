package com.mockmate.dto;

import com.mockmate.model.CodingSubmission;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CodingSubmissionDto {
    private Long id;
    private Long userId;
    private Long questionId;
    private Long interviewSessionId;
    private String code;
    private CodingSubmission.ProgrammingLanguage language;
    private CodingSubmission.SubmissionStatus status;
    private Double score;
    private Integer executionTimeMs;
    private Integer memoryUsageKb;
    private String compilationError;
    private String runtimeError;
    private String feedback;
    private Integer testCasesPassed;
    private Integer totalTestCases;
    private LocalDateTime submittedAt;
    private LocalDateTime evaluatedAt;
    
    public static CodingSubmissionDto fromCodingSubmission(CodingSubmission submission) {
        CodingSubmissionDto dto = new CodingSubmissionDto();
        dto.setId(submission.getId());
        dto.setUserId(submission.getUser().getId());
        dto.setQuestionId(submission.getQuestion().getId());
        if (submission.getInterviewSession() != null) {
            dto.setInterviewSessionId(submission.getInterviewSession().getId());
        }
        dto.setCode(submission.getCode());
        dto.setLanguage(submission.getLanguage());
        dto.setStatus(submission.getStatus());
        dto.setScore(submission.getScore());
        dto.setExecutionTimeMs(submission.getExecutionTimeMs());
        dto.setMemoryUsageKb(submission.getMemoryUsageKb());
        dto.setCompilationError(submission.getCompilationError());
        dto.setRuntimeError(submission.getRuntimeError());
        dto.setFeedback(submission.getFeedback());
        dto.setTestCasesPassed(submission.getTestCasesPassed());
        dto.setTotalTestCases(submission.getTotalTestCases());
        dto.setSubmittedAt(submission.getSubmittedAt());
        dto.setEvaluatedAt(submission.getEvaluatedAt());
        return dto;
    }
}
