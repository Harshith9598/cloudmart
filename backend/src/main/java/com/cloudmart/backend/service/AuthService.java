package com.cloudmart.backend.service;

import com.cloudmart.backend.dto.*;
import com.cloudmart.backend.entity.Role;
import com.cloudmart.backend.entity.User;
import com.cloudmart.backend.exception.ConflictException;
import com.cloudmart.backend.exception.ResourceNotFoundException;
import com.cloudmart.backend.exception.UnauthorizedException;
import com.cloudmart.backend.mapper.UserMapper;
import com.cloudmart.backend.repository.RoleRepository;
import com.cloudmart.backend.repository.UserRepository;
import com.cloudmart.backend.security.JwtTokenProvider;
import com.cloudmart.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ConflictException("Email already registered");
        }

        Role customerRole = roleRepository.findByName("CUSTOMER")
                .orElseThrow(() -> new ResourceNotFoundException("Default role not found"));

        User user = new User();
        user.setEmail(req.getEmail());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setActive(true);
        user.setRoles(new HashSet<>(Set.of(customerRole)));
        user = userRepository.save(user);

        log.info("New user registered: {}", req.getEmail());

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (!user.getActive()) {
            throw new UnauthorizedException("Account is deactivated");
        }

        log.info("User logged in: {}", req.getEmail());
        return buildAuthResponse(user);
    }

    public AuthResponse refresh(RefreshTokenRequest req) {
        if (!jwtTokenProvider.validateToken(req.getRefreshToken())) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        Long userId = jwtTokenProvider.getUserIdFromToken(req.getRefreshToken());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return buildAuthResponse(user);
    }

    public UserDto getCurrentUser() {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.toDto(user);
    }

    public void logout() {
        // Stateless JWT — client discards tokens.
        // Server-side invalidation would use a token blocklist in Redis.
        log.info("User {} logged out", SecurityUtils.getCurrentUserId());
    }

    private AuthResponse buildAuthResponse(User user) {
        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .toList();

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), roleNames);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId(), user.getEmail());

        AuthResponse response = new AuthResponse();
        response.setUser(userMapper.toDto(user));
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setTokenType("Bearer");
        response.setExpiresIn(3600);
        return response;
    }
}
