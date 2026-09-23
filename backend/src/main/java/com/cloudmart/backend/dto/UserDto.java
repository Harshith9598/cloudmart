package com.cloudmart.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter @Setter
public class UserDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Set<String> roles;
    private SellerProfileDto sellerProfile;
    private String createdAt;
}
