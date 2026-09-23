package com.cloudmart.backend.controller;

import com.cloudmart.backend.dto.*;
import com.cloudmart.backend.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart management")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "Get current user's cart")
    public ResponseEntity<CartDto> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @PostMapping("/items")
    @Operation(summary = "Add an item to the cart")
    public ResponseEntity<CartDto> addToCart(@Valid @RequestBody AddToCartRequest req) {
        return ResponseEntity.ok(cartService.addToCart(req));
    }

    @PutMapping("/items/{itemId}")
    @Operation(summary = "Update cart item quantity")
    public ResponseEntity<CartDto> updateCartItem(@PathVariable Long itemId, @Valid @RequestBody UpdateCartItemRequest req) {
        return ResponseEntity.ok(cartService.updateCartItem(itemId, req));
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Remove an item from the cart")
    public ResponseEntity<CartDto> removeCartItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeCartItem(itemId));
    }

    @DeleteMapping
    @Operation(summary = "Clear the entire cart")
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.noContent().build();
    }
}
