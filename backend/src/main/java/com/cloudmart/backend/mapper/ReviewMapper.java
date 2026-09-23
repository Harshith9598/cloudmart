package com.cloudmart.backend.mapper;

import com.cloudmart.backend.dto.ReviewDto;
import com.cloudmart.backend.entity.Review;
import org.springframework.stereotype.Component;

/**
 * Manual mapper between {@link Review} entities and {@link ReviewDto}.
 */
@Component
public class ReviewMapper {

    public ReviewDto toDto(Review review) {
        if (review == null) {
            return null;
        }

        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());

        if (review.getProduct() != null) {
            dto.setProductId(review.getProduct().getId());
        }

        if (review.getUser() != null) {
            dto.setUserId(review.getUser().getId());
            dto.setUserFirstName(review.getUser().getFirstName());
        }

        dto.setRating(review.getRating());
        dto.setTitle(review.getTitle());
        dto.setComment(review.getComment());
        dto.setVerifiedPurchase(review.getVerifiedPurchase());
        dto.setSellerReply(review.getSellerReply());

        if (review.getSellerReplyAt() != null) {
            dto.setSellerReplyAt(review.getSellerReplyAt().toString());
        }
        if (review.getCreatedAt() != null) {
            dto.setCreatedAt(review.getCreatedAt().toString());
        }
        if (review.getUpdatedAt() != null) {
            dto.setUpdatedAt(review.getUpdatedAt().toString());
        }
        return dto;
    }
}
