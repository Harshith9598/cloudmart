package com.cloudmart.backend.service;

import com.cloudmart.backend.dto.CreateSellerRequest;
import com.cloudmart.backend.dto.PaginatedResponse;
import com.cloudmart.backend.dto.ProductDto;
import com.cloudmart.backend.dto.SellerProfileDto;
import com.cloudmart.backend.entity.Role;
import com.cloudmart.backend.entity.SellerProfile;
import com.cloudmart.backend.entity.User;
import com.cloudmart.backend.exception.ConflictException;
import com.cloudmart.backend.exception.ResourceNotFoundException;
import com.cloudmart.backend.mapper.ProductMapper;
import com.cloudmart.backend.mapper.SellerProfileMapper;
import com.cloudmart.backend.repository.*;
import com.cloudmart.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class SellerService {

    private final SellerProfileRepository sellerProfileRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProductRepository productRepository;
    private final SellerProfileMapper sellerProfileMapper;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public PaginatedResponse<SellerProfileDto> listSellers(Pageable pageable) {
        Page<SellerProfile> page = sellerProfileRepository.findAll(pageable);
        return PaginatedResponse.from(page.map(sellerProfileMapper::toDto));
    }

    @Transactional(readOnly = true)
    public SellerProfileDto getSeller(String idOrSlug) {
        SellerProfile seller = sellerProfileRepository.findBySlug(idOrSlug)
                .orElseGet(() -> {
                    try {
                        return sellerProfileRepository.findById(Long.parseLong(idOrSlug))
                                .orElseThrow(() -> new ResourceNotFoundException("Seller not found: " + idOrSlug));
                    } catch (NumberFormatException e) {
                        throw new ResourceNotFoundException("Seller not found: " + idOrSlug);
                    }
                });
        return sellerProfileMapper.toDto(seller);
    }

    @Transactional
    public SellerProfileDto becomeSeller(CreateSellerRequest req) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (sellerProfileRepository.findByUserId(userId).isPresent()) {
            throw new ConflictException("You are already a seller");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Role sellerRole = roleRepository.findByName("SELLER")
                .orElseThrow(() -> new ResourceNotFoundException("Seller role not found"));
        Set<Role> roles = new HashSet<>(user.getRoles());
        roles.add(sellerRole);
        user.setRoles(roles);
        userRepository.save(user);

        SellerProfile profile = new SellerProfile();
        profile.setUser(user);
        profile.setStoreName(req.getStoreName());
        profile.setSlug(generateSlug(req.getStoreName()));
        profile.setDescription(req.getDescription());
        profile.setVerified(false);
        profile.setRating(java.math.BigDecimal.ZERO);
        profile.setTotalSales(0);
        profile = sellerProfileRepository.save(profile);

        log.info("User {} became seller: {}", userId, profile.getStoreName());
        return sellerProfileMapper.toDto(profile);
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<ProductDto> getSellerProducts(Long sellerId, Pageable pageable) {
        Page<com.cloudmart.backend.entity.Product> page = productRepository.findByActiveTrueAndSellerId(sellerId, pageable);
        return PaginatedResponse.from(page.map(productMapper::toDto));
    }

    private String generateSlug(String name) {
        return name.toLowerCase().replaceAll("[^a-z0-9\\s]", "").replaceAll("\\s+", "-")
                + "-" + System.currentTimeMillis();
    }
}
