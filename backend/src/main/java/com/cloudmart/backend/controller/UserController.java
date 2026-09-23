package com.cloudmart.backend.controller;

import com.cloudmart.backend.dto.ChangePasswordRequest;
import com.cloudmart.backend.dto.UpdateUserRequest;
import com.cloudmart.backend.dto.UserDto;
import com.cloudmart.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile management")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "Get current user's profile")
    public ResponseEntity<UserDto> getProfile() {
        return ResponseEntity.ok(userService.getProfile());
    }

    @PutMapping("/profile")
    @Operation(summary = "Update current user's profile")
    public ResponseEntity<UserDto> updateProfile(@Valid @RequestBody UpdateUserRequest req) {
        return ResponseEntity.ok(userService.updateProfile(req));
    }

    @PostMapping("/password")
    @Operation(summary = "Change current user's password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest req) {
        userService.changePassword(req);
        return ResponseEntity.noContent().build();
    }
}
