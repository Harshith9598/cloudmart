package com.cloudmart.backend.repository;

import com.cloudmart.backend.entity.SellerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerProfileRepository extends JpaRepository<SellerProfile, Long> {
    Optional<SellerProfile> findBySlug(String slug);
    Optional<SellerProfile> findByUserId(Long userId);
    Page<SellerProfile> findByVerifiedTrue(Pageable pageable);
    Page<SellerProfile> findByStoreNameContainingIgnoreCase(String storeName, Pageable pageable);
}
