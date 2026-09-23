package com.cloudmart.backend.service;

import com.cloudmart.backend.dto.AuthResponse;
import com.cloudmart.backend.dto.LoginRequest;
import com.cloudmart.backend.dto.RegisterRequest;
import com.cloudmart.backend.exception.ConflictException;
import com.cloudmart.backend.exception.UnauthorizedException;
import com.cloudmart.backend.repository.RoleRepository;
import com.cloudmart.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AuthServiceTest {

    @Autowired
    private AuthService authService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFirstName("Test");
        registerRequest.setLastName("User");
    }

    @Test
    void register_shouldCreateUserAndReturnTokens() {
        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertNotNull(response.getAccessToken());
        assertNotNull(response.getRefreshToken());
        assertEquals("test@example.com", response.getUser().getEmail());
    }

    @Test
    void register_duplicateEmail_shouldThrowConflict() {
        authService.register(registerRequest);
        assertThrows(ConflictException.class, () -> authService.register(registerRequest));
    }

    @Test
    void login_validCredentials_shouldReturnTokens() {
        authService.register(registerRequest);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        AuthResponse response = authService.login(loginRequest);
        assertNotNull(response.getAccessToken());
    }

    @Test
    void login_invalidPassword_shouldThrowUnauthorized() {
        authService.register(registerRequest);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("wrong");

        assertThrows(UnauthorizedException.class, () -> authService.login(loginRequest));
    }

    @Test
    void login_nonexistentUser_shouldThrowUnauthorized() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("nobody@example.com");
        loginRequest.setPassword("password123");

        assertThrows(UnauthorizedException.class, () -> authService.login(loginRequest));
    }
}
