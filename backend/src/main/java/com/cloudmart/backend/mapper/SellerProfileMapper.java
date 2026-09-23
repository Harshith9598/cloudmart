package com.cloudmart.backend.mapper;

import com.cloudmart.backend.dto.SellerProfileDto;
import com.cloudmart.backend.entity.SellerProfile;
import org.springframework.stereotype.Component;

/**
 * Manual mapper between {@link SellerProfile} entities and {@link SellerProfileDto}.
 */
@Component
public class SellerProfileMapper {

    public SellerProfileDto toDto(SellerProfile seller) {
        if (seller == null) {
            return null;
        }

        SellerProfileDto dto = new SellerProfileDto();
        dto.setId(seller.getId());
        if (seller.getUser() != null) {
            dto.setUserId(seller.getUser().getId());
        }
        dto.setStoreName(seller.getStoreName());
        dto.setSlug(seller.getSlug());
        dto.setDescription(seller.getDescription());
        dto.setLogoUrl(seller.getLogoUrl());
        dto.setVerified(seller.getVerified());
        dto.setRating(seller.getRating());
        dto.setTotalSales(seller.getTotalSales());
        if (seller.getCreatedAt() != null) {
            dto.setCreatedAt(seller.getCreatedAt().toString());
        }
        return dto;
    }
}
