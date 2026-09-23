package com.cloudmart.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * Request body for a seller replying to a product review.
 */
@Getter
@Setter
public class ReplyReviewRequest {

    @NotBlank(message = "Reply is required")
    private String reply;
}
