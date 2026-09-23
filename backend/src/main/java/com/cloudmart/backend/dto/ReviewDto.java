package com.cloudmart.backend.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Public representation of a product review, including the seller's optional
 * reply and whether the reviewer has a verified purchase.
 */
@Getter
@Setter
public class ReviewDto {

    private Long id;
    private Long productId;
    private Long userId;
    private String userFirstName;
    private Integer rating;
    private String title;
    private String comment;
    private Boolean verifiedPurchase;
    private String sellerReply;
    private String sellerReplyAt;
    private String createdAt;
    private String updatedAt;
}
