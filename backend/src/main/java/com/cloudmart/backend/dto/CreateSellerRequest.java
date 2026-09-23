package com.cloudmart.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateSellerRequest {
    @NotBlank
    private String storeName;

    @NotBlank
    private String description;
}
