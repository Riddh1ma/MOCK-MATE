package com.mockmate.dto;

import com.mockmate.model.CodingSubmission;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubmitCodeRequest {
    
    //@NotNull
    private Long questionId;
    
    private Long interviewSessionId;
    
    //@NotBlank
    private String code;
    
    //@NotNull
    private CodingSubmission.ProgrammingLanguage language;
}
