package com.cloudmart.backend.service;

import com.cloudmart.backend.dto.*;
import com.cloudmart.backend.entity.*;
import com.cloudmart.backend.exception.BadRequestException;
import com.cloudmart.backend.exception.ForbiddenException;
import com.cloudmart.backend.exception.ResourceNotFoundException;
import com.cloudmart.backend.mapper.ProductMapper;
import com.cloudmart.backend.repository.*;
import com.cloudmart.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final CategoryRepository categoryRepository;
    private final SellerProfileRepository sellerProfileRepository;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public PaginatedResponse<ProductDto> listProducts(
            Long categoryId, Long sellerId, BigDecimal minPrice, BigDecimal maxPrice,
            Boolean featured, String search, Pageable pageable) {

        Page<Product> page = productRepository.findFiltered(
                categoryId, sellerId, minPrice, maxPrice, featured, search, pageable);

        return PaginatedResponse.from(page.map(productMapper::toDto));
    }

    @Cacheable(value = "product", key = "#idOrSlug")
    @Transactional(readOnly = true)
    public ProductDto getProduct(String idOrSlug) {
        Product product = productRepository.findBySlug(idOrSlug)
                .orElseGet(() -> {
                    try {
                        return productRepository.findById(Long.parseLong(idOrSlug))
                                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + idOrSlug));
                    } catch (NumberFormatException e) {
                        throw new ResourceNotFoundException("Product not found: " + idOrSlug);
                    }
                });
        return productMapper.toDto(product);
    }

    @Cacheable(value = "products", key = "'featured'")
    @Transactional(readOnly = true)
    public List<ProductDto> getFeatured() {
        return productRepository.findByActiveTrueAndFeaturedTrue(Pageable.ofSize(20))
                .stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }

    @CacheEvict(value = {"products", "product"}, allEntries = true)
    @Transactional
    public ProductDto createProduct(CreateProductRequest req) {
        Long userId = SecurityUtils.getCurrentUserId();
        SellerProfile seller = sellerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ForbiddenException("You are not a seller"));

        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (productRepository.findBySku(req.getSku()).isPresent()) {
            throw new BadRequestException("SKU already exists");
        }

        Product product = new Product();
        product.setSeller(seller);
        product.setCategory(category);
        product.setName(req.getName());
        product.setSlug(generateSlug(req.getName()));
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice());
        product.setCompareAtPrice(req.getCompareAtPrice());
        product.setSku(req.getSku());
        product.setStock(req.getStock());
        product.setRating(BigDecimal.ZERO);
        product.setReviewCount(0);
        product.setActive(true);
        product.setFeatured(req.getFeatured() != null && req.getFeatured());

        if (req.getImages() != null) {
            List<ProductImage> images = new ArrayList<>();
            for (int i = 0; i < req.getImages().size(); i++) {
                CreateProductImageDto imgDto = req.getImages().get(i);
                ProductImage img = new ProductImage();
                img.setProduct(product);
                img.setUrl(imgDto.getUrl());
                img.setAltText(imgDto.getAltText());
                img.setIsPrimary(imgDto.getIsPrimary() != null && imgDto.getIsPrimary());
                img.setDisplayOrder(imgDto.getDisplayOrder() != null ? imgDto.getDisplayOrder() : i);
                images.add(img);
            }
            product.setImages(images);
        }

        product = productRepository.save(product);
        log.info("Product created: {} by seller {}", product.getId(), seller.getId());
        return productMapper.toDto(product);
    }

    @CacheEvict(value = {"products", "product"}, allEntries = true)
    @Transactional
    public ProductDto updateProduct(Long id, UpdateProductRequest req) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        verifyOwnership(product);

        if (req.getCategoryId() != null) {
            Category category = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }
        if (req.getName() != null) product.setName(req.getName());
        if (req.getDescription() != null) product.setDescription(req.getDescription());
        if (req.getPrice() != null) product.setPrice(req.getPrice());
        if (req.getCompareAtPrice() != null) product.setCompareAtPrice(req.getCompareAtPrice());
        if (req.getStock() != null) product.setStock(req.getStock());
        if (req.getFeatured() != null) product.setFeatured(req.getFeatured());
        if (req.getActive() != null) product.setActive(req.getActive());

        product = productRepository.save(product);
        return productMapper.toDto(product);
    }

    @CacheEvict(value = {"products", "product"}, allEntries = true)
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        verifyOwnership(product);
        productRepository.delete(product);
    }

    private void verifyOwnership(Product product) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (SecurityUtils.isAdmin()) return;
        if (!product.getSeller().getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not own this product");
        }
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-")
                + "-" + System.currentTimeMillis();
    }
}
