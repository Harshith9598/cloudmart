package com.cloudmart.backend.mapper;

import com.cloudmart.backend.dto.CategoryDto;
import com.cloudmart.backend.entity.Category;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Manual mapper between {@link Category} entities and {@link CategoryDto}.
 * Recursively maps the full child category tree.
 */
@Component
public class CategoryMapper {

    public CategoryDto toDto(Category category) {
        if (category == null) {
            return null;
        }

        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setSlug(category.getSlug());
        dto.setDescription(category.getDescription());
        dto.setIconUrl(category.getIconUrl());

        if (category.getParent() != null) {
            dto.setParentId(category.getParent().getId());
        }

        if (category.getChildren() != null) {
            List<CategoryDto> childDtos = category.getChildren().stream()
                    .map(this::toDto)
                    .collect(Collectors.toList());
            dto.setChildren(childDtos);
        }

        return dto;
    }
}
