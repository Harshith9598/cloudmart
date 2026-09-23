package com.cloudmart.backend.repository;

import com.cloudmart.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);
    Optional<Product> findBySku(String sku);

    Page<Product> findByActiveTrue(Pageable pageable);
    Page<Product> findByActiveTrueAndFeaturedTrue(Pageable pageable);
    Page<Product> findByActiveTrueAndCategoryId(Long categoryId, Pageable pageable);
    Page<Product> findByActiveTrueAndSellerId(Long sellerId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:sellerId IS NULL OR p.seller.id = :sellerId) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:featured IS NULL OR p.featured = :featured) AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> findFiltered(
        @Param("categoryId") Long categoryId,
        @Param("sellerId") Long sellerId,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("featured") Boolean featured,
        @Param("search") String search,
        Pageable pageable
    );
}
