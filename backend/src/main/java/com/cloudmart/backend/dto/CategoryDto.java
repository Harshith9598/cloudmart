package com.cloudmart.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class CategoryDto {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String iconUrl;
    private Long parentId;
    private List<CategoryDto> children;
}
