package com.cloudmart.backend.mapper;

import com.cloudmart.backend.dto.CartDto;
import com.cloudmart.backend.dto.CartItemDto;
import com.cloudmart.backend.entity.Cart;
import com.cloudmart.backend.entity.CartItem;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Manual mapper between {@link Cart} entities and {@link CartDto}. Computes
 * the monetary subtotal and total item count from the cart's line items.
 */
@Component
public class CartMapper {

    public CartDto toDto(Cart cart) {
        if (cart == null) {
            return null;
        }

        CartDto dto = new CartDto();
        dto.setId(cart.getId());

        if (cart.getUser() != null) {
            dto.setUserId(cart.getUser().getId());
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        int totalItems = 0;

        if (cart.getItems() != null) {
            List<CartItemDto> itemDtos = cart.getItems().stream()
                    .map(this::toCartItemDto)
                    .collect(Collectors.toList());
            dto.setItems(itemDtos);

            for (CartItem item : cart.getItems()) {
                if (item.getPrice() != null && item.getQuantity() != null) {
                    subtotal = subtotal.add(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                    totalItems += item.getQuantity();
                }
            }
        }

        dto.setSubtotal(subtotal);
        dto.setTotalItems(totalItems);

        if (cart.getUpdatedAt() != null) {
            dto.setUpdatedAt(cart.getUpdatedAt().toString());
        }
        return dto;
    }

    private CartItemDto toCartItemDto(CartItem item) {
        CartItemDto dto = new CartItemDto();
        dto.setId(item.getId());

        if (item.getProduct() != null) {
            dto.setProductId(item.getProduct().getId());
            dto.setProductName(item.getProduct().getName());
            dto.setProductSlug(item.getProduct().getSlug());
            dto.setStock(item.getProduct().getStock());

            if (item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()) {
                dto.setProductImage(item.getProduct().getImages().get(0).getUrl());
            }

            if (item.getProduct().getSeller() != null) {
                dto.setSellerId(item.getProduct().getSeller().getId());
                dto.setSellerName(item.getProduct().getSeller().getStoreName());
            }
        }

        dto.setPrice(item.getPrice());
        dto.setQuantity(item.getQuantity());
        return dto;
    }
}
