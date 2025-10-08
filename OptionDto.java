package com.mockmate.dto;

import com.mockmate.model.Option;
import lombok.Data;

@Data
public class OptionDto {
    private Long id;
    private String text;
    private boolean isCorrect;
    private String optionLabel;
    
    public static OptionDto fromOption(Option option) {
        OptionDto dto = new OptionDto();
        dto.setId(option.getId());
        dto.setText(option.getText());
        dto.setCorrect(option.isCorrect());
        dto.setOptionLabel(option.getOptionLabel());
        return dto;
    }
}
