package com.cloudmart.backend.repository;

import com.cloudmart.backend.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);
    Page<Review> findByProductIdAndRating(Long productId, Integer rating, Pageable pageable);
    Optional<Review> findByProductIdAndUserId(Long productId, Long userId);
    long countByProductId(Long productId);
}
