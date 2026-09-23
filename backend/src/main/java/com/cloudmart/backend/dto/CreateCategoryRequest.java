package com.cloudmart.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateCategoryRequest {
    @NotBlank
    private String name;
    private String description;
    private Long parentId;
}
