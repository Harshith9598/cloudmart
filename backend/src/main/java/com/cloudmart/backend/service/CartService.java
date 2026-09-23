package com.cloudmart.backend.service;

import com.cloudmart.backend.dto.*;
import com.cloudmart.backend.entity.Cart;
import com.cloudmart.backend.entity.CartItem;
import com.cloudmart.backend.entity.Product;
import com.cloudmart.backend.entity.User;
import com.cloudmart.backend.exception.BadRequestException;
import com.cloudmart.backend.exception.ResourceNotFoundException;
import com.cloudmart.backend.mapper.CartMapper;
import com.cloudmart.backend.repository.*;
import com.cloudmart.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    @Transactional
    public CartDto getCart() {
        Cart cart = getOrCreateCart();
        return cartMapper.toDto(cart);
    }

    @Transactional
    public CartDto addToCart(AddToCartRequest req) {
        Cart cart = getOrCreateCart();
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStock() < req.getQuantity()) {
            throw new BadRequestException("Insufficient stock");
        }

        Optional<CartItem> existing = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());
        if (existing.isPresent()) {
            CartItem item = existing.get();
            int newQty = item.getQuantity() + req.getQuantity();
            if (newQty > product.getStock()) {
                throw new BadRequestException("Insufficient stock");
            }
            item.setQuantity(newQty);
            cartItemRepository.save(item);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(req.getQuantity());
            item.setPrice(product.getPrice());
            cartItemRepository.save(item);
        }

        cart = cartRepository.findById(cart.getId()).orElseThrow();
        return cartMapper.toDto(cart);
    }

    @Transactional
    public CartDto updateCartItem(Long itemId, UpdateCartItemRequest req) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        Long userId = SecurityUtils.getCurrentUserId();
        if (!item.getCart().getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Cart item not found");
        }

        if (req.getQuantity() <= 0) {
            cartItemRepository.delete(item);
        } else {
            if (req.getQuantity() > item.getProduct().getStock()) {
                throw new BadRequestException("Insufficient stock");
            }
            item.setQuantity(req.getQuantity());
            cartItemRepository.save(item);
        }

        Cart cart = getOrCreateCart();
        return cartMapper.toDto(cart);
    }

    @Transactional
    public CartDto removeCartItem(Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        Long userId = SecurityUtils.getCurrentUserId();
        if (!item.getCart().getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Cart item not found");
        }

        cartItemRepository.delete(item);
        Cart cart = getOrCreateCart();
        return cartMapper.toDto(cart);
    }

    @Transactional
    public void clearCart() {
        Cart cart = getOrCreateCart();
        cartItemRepository.deleteAll(cart.getItems());
    }

    private Cart getOrCreateCart() {
        Long userId = SecurityUtils.getCurrentUserId();
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        });
    }
}
