package com.cloudmart.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter
public class SellerProfileDto {
    private Long id;
    private Long userId;
    private String storeName;
    private String slug;
    private String description;
    private String logoUrl;
    private Boolean verified;
    private BigDecimal rating;
    private Integer totalSales;
    private String createdAt;
}
