package com.cloudmart.backend.mapper;

import com.cloudmart.backend.dto.ProductDto;
import com.cloudmart.backend.entity.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Manual mapper between {@link Product} entities and {@link ProductDto}. Flattens
 * seller and category metadata, maps images via {@link ProductImageMapper}, and
 * converts timestamps to ISO-8601 strings.
 */
@Component
@RequiredArgsConstructor
public class ProductMapper {

    private final ProductImageMapper productImageMapper;

    public ProductDto toDto(Product product) {
        if (product == null) {
            return null;
        }

        ProductDto dto = new ProductDto();
        dto.setId(product.getId());

        if (product.getSeller() != null) {
            dto.setSellerId(product.getSeller().getId());
            dto.setSellerName(product.getSeller().getStoreName());
            dto.setSellerSlug(product.getSeller().getSlug());
            dto.setSellerVerified(product.getSeller().getVerified());
        }

        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }

        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCompareAtPrice(product.getCompareAtPrice());
        dto.setSku(product.getSku());
        dto.setStock(product.getStock());
        dto.setRating(product.getRating());
        dto.setReviewCount(product.getReviewCount());

        if (product.getImages() != null) {
            List<ProductImageDto> imageDtos = product.getImages().stream()
                    .map(productImageMapper::toDto)
                    .collect(Collectors.toList());
            dto.setImages(imageDtos);
        }

        dto.setActive(product.getActive());
        dto.setFeatured(product.getFeatured());

        if (product.getCreatedAt() != null) {
            dto.setCreatedAt(product.getCreatedAt().toString());
        }
        if (product.getUpdatedAt() != null) {
            dto.setUpdatedAt(product.getUpdatedAt().toString());
        }
        return dto;
    }
}
