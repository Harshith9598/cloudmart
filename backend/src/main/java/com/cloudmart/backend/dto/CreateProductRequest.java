package com.cloudmart.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter @Setter
public class CreateProductRequest {
    @NotNull
    private Long categoryId;
    @NotBlank
    private String name;
    @NotBlank
    private String description;
    @NotNull
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    @NotBlank
    private String sku;
    @NotNull
    private Integer stock;
    private List<CreateProductImageDto> images;
    private Boolean featured;
}
