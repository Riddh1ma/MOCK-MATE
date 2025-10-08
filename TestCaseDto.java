package com.mockmate.dto;

import com.mockmate.model.TestCase;
import lombok.Data;

@Data
public class TestCaseDto {
    private Long id;
    private String input;
    private String expectedOutput;
    private boolean isHidden;
    private Integer points;
    private String description;
    
    public static TestCaseDto fromTestCase(TestCase testCase) {
        TestCaseDto dto = new TestCaseDto();
        dto.setId(testCase.getId());
        dto.setInput(testCase.getInput());
        dto.setExpectedOutput(testCase.getExpectedOutput());
        dto.setHidden(testCase.isHidden());
        dto.setPoints(testCase.getPoints());
        dto.setDescription(testCase.getDescription());
        return dto;
    }
}
