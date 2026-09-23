package com.cloudmart.backend.controller;

import com.cloudmart.backend.dto.*;
import com.cloudmart.backend.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Product reviews and seller replies")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    @Operation(summary = "List reviews for a product")
    public ResponseEntity<PaginatedResponse<ReviewDto>> listReviews(
            @RequestParam Long productId,
            @RequestParam(required = false) Integer rating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(reviewService.listByProduct(productId, rating, pageable));
    }

    @PostMapping
    @Operation(summary = "Create a review for a product")
    public ResponseEntity<ReviewDto> createReview(@Valid @RequestBody CreateReviewRequest req) {
        return ResponseEntity.ok(reviewService.createReview(req));
    }

    @PostMapping("/{reviewId}/reply")
    @Operation(summary = "Reply to a review (seller or admin)")
    public ResponseEntity<ReviewDto> replyReview(@PathVariable Long reviewId, @Valid @RequestBody ReplyReviewRequest req) {
        return ResponseEntity.ok(reviewService.replyReview(reviewId, req));
    }
}
