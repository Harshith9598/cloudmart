package com.cloudmart.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;

    @BeforeEach
    void setUp() {
        String secret = "this-is-a-test-jwt-secret-key-with-at-least-32-bytes-for-hs256";
        tokenProvider = new JwtTokenProvider(secret, 3600000L, 604800000L);
    }

    @Test
    void generateAndValidateAccessToken_shouldRoundTrip() {
        String token = tokenProvider.generateAccessToken(1L, "user@example.com", List.of("CUSTOMER"));
        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
        assertEquals(1L, tokenProvider.getUserIdFromToken(token));
        assertEquals("user@example.com", tokenProvider.getEmailFromToken(token));
    }

    @Test
    void validateToken_invalidToken_shouldReturnFalse() {
        assertFalse(tokenProvider.validateToken("invalid.token.here"));
    }

    @Test
    void generateRefreshToken_shouldBeValid() {
        String token = tokenProvider.generateRefreshToken(1L, "user@example.com");
        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
    }

    @Test
    void getRolesFromToken_shouldReturnRoles() {
        String token = tokenProvider.generateAccessToken(1L, "user@example.com", List.of("CUSTOMER", "SELLER"));
        List<String> roles = tokenProvider.getRolesFromToken(token);
        assertTrue(roles.contains("CUSTOMER"));
        assertTrue(roles.contains("SELLER"));
    }
}
