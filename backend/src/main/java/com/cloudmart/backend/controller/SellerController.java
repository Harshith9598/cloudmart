package com.cloudmart.backend.controller;

import com.cloudmart.backend.dto.*;
import com.cloudmart.backend.service.SellerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sellers")
@RequiredArgsConstructor
@Tag(name = "Sellers", description = "Seller profiles and marketplace onboarding")
public class SellerController {

    private final SellerService sellerService;

    @GetMapping
    @Operation(summary = "List all sellers")
    public ResponseEntity<PaginatedResponse<SellerProfileDto>> listSellers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(sellerService.listSellers(pageable));
    }

    @GetMapping("/{idOrSlug}")
    @Operation(summary = "Get a seller by ID or slug")
    public ResponseEntity<SellerProfileDto> getSeller(@PathVariable String idOrSlug) {
        return ResponseEntity.ok(sellerService.getSeller(idOrSlug));
    }

    @PostMapping
    @Operation(summary = "Become a seller (current user)")
    public ResponseEntity<SellerProfileDto> becomeSeller(@Valid @RequestBody CreateSellerRequest req) {
        return ResponseEntity.ok(sellerService.becomeSeller(req));
    }

    @GetMapping("/{sellerId}/products")
    @Operation(summary = "List products by a seller")
    public ResponseEntity<PaginatedResponse<ProductDto>> getSellerProducts(
            @PathVariable Long sellerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(sellerService.getSellerProducts(sellerId, pageable));
    }
}
