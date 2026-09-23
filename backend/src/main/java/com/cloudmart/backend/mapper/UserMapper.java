package com.cloudmart.backend.mapper;

import com.cloudmart.backend.dto.UserDto;
import com.cloudmart.backend.entity.Role;
import com.cloudmart.backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * Manual mapper between {@link User} entities and {@link UserDto}. Delegates
 * seller-profile mapping to {@link SellerProfileMapper}.
 */
@Component
@RequiredArgsConstructor
public class UserMapper {

    private final SellerProfileMapper sellerProfileMapper;

    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }

        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRoles(mapRoles(user.getRoles()));
        dto.setSellerProfile(sellerProfileMapper.toDto(user.getSellerProfile()));
        if (user.getCreatedAt() != null) {
            dto.setCreatedAt(user.getCreatedAt().toString());
        }
        return dto;
    }

    private Set<String> mapRoles(Set<Role> roles) {
        if (roles == null) {
            return null;
        }
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
    }
}
