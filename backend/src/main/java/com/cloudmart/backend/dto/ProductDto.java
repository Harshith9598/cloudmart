package com.cloudmart.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter @Setter
public class ProductDto {
    private Long id;
    private Long sellerId;
    private String sellerName;
    private String sellerSlug;
    private Boolean sellerVerified;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private String sku;
    private Integer stock;
    private BigDecimal rating;
    private Integer reviewCount;
    private List<ProductImageDto> images;
    private Boolean active;
    private Boolean featured;
    private String createdAt;
    private String updatedAt;
}
