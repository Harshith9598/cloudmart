package com.cloudmart.backend.service;

import com.cloudmart.backend.dto.*;
import com.cloudmart.backend.entity.Order;
import com.cloudmart.backend.entity.Product;
import com.cloudmart.backend.entity.Review;
import com.cloudmart.backend.entity.User;
import com.cloudmart.backend.exception.ConflictException;
import com.cloudmart.backend.exception.ForbiddenException;
import com.cloudmart.backend.exception.ResourceNotFoundException;
import com.cloudmart.backend.mapper.ReviewMapper;
import com.cloudmart.backend.repository.*;
import com.cloudmart.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReviewMapper reviewMapper;

    @Transactional(readOnly = true)
    public PaginatedResponse<ReviewDto> listByProduct(Long productId, Integer rating, Pageable pageable) {
        Page<Review> page;
        if (rating != null) {
            page = reviewRepository.findByProductIdAndRating(productId, rating, pageable);
        } else {
            page = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);
        }
        return PaginatedResponse.from(page.map(reviewMapper::toDto));
    }

    @Transactional
    public ReviewDto createReview(CreateReviewRequest req) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (reviewRepository.findByProductIdAndUserId(product.getId(), userId).isPresent()) {
            throw new ConflictException("You have already reviewed this product");
        }

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(req.getRating());
        review.setTitle(req.getTitle());
        review.setComment(req.getComment());
        review.setVerifiedPurchase(false);
        review = reviewRepository.save(review);

        updateProductRating(product.getId());

        log.info("Review created: {} for product {}", review.getId(), product.getId());
        return reviewMapper.toDto(review);
    }

    @Transactional
    public ReviewDto replyReview(Long reviewId, ReplyReviewRequest req) {
        Long userId = SecurityUtils.getCurrentUserId();
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        Product product = review.getProduct();
        if (!SecurityUtils.isAdmin() && !product.getSeller().getUser().getId().equals(userId)) {
            throw new ForbiddenException("Only the product seller can reply to reviews");
        }

        review.setSellerReply(req.getReply());
        review.setSellerReplyAt(Instant.now());
        review = reviewRepository.save(review);
        return reviewMapper.toDto(review);
    }

    private void updateProductRating(Long productId) {
        long count = reviewRepository.countByProductId(productId);
        if (count == 0) return;

        // Compute average rating
        Page<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, Pageable.ofSize(1000));
        double avg = reviews.getContent().stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        Product product = productRepository.findById(productId).orElseThrow();
        product.setRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
        product.setReviewCount((int) count);
        productRepository.save(product);
    }
}
