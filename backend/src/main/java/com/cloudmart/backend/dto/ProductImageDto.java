package com.cloudmart.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ProductImageDto {
    private Long id;
    private String url;
    private String altText;
    private Boolean isPrimary;
    private Integer displayOrder;
}
