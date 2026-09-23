package com.cloudmart.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateProductImageDto {
    private String url;
    private String altText;
    private Boolean isPrimary;
    private Integer displayOrder;
}
