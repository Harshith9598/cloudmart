package com.cloudmart.backend.service;

import com.cloudmart.backend.dto.ChangePasswordRequest;
import com.cloudmart.backend.dto.UpdateUserRequest;
import com.cloudmart.backend.dto.UserDto;
import com.cloudmart.backend.exception.BadRequestException;
import com.cloudmart.backend.exception.ResourceNotFoundException;
import com.cloudmart.backend.mapper.UserMapper;
import com.cloudmart.backend.repository.UserRepository;
import com.cloudmart.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cloudmart.backend.entity.User;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserDto getProfile() {
        return userMapper.toDto(getCurrentUser());
    }

    @Transactional
    public UserDto updateProfile(UpdateUserRequest req) {
        User user = getCurrentUser();
        if (req.getFirstName() != null) user.setFirstName(req.getFirstName());
        if (req.getLastName() != null) user.setLastName(req.getLastName());
        user = userRepository.save(user);
        return userMapper.toDto(user);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest req) {
        User user = getCurrentUser();
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }

    private User getCurrentUser() {
        return userRepository.findById(SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
