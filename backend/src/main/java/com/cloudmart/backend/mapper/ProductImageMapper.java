package com.cloudmart.backend.mapper;

import com.cloudmart.backend.dto.ProductImageDto;
import com.cloudmart.backend.entity.ProductImage;
import org.springframework.stereotype.Component;

/**
 * Manual mapper between {@link ProductImage} entities and {@link ProductImageDto}.
 */
@Component
public class ProductImageMapper {

    public ProductImageDto toDto(ProductImage image) {
        if (image == null) {
            return null;
        }

        ProductImageDto dto = new ProductImageDto();
        dto.setId(image.getId());
        dto.setUrl(image.getUrl());
        dto.setAltText(image.getAltText());
        dto.setIsPrimary(image.getIsPrimary());
        dto.setDisplayOrder(image.getDisplayOrder());
        return dto;
    }
}
