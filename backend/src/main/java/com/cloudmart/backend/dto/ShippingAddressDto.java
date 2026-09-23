package com.cloudmart.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ShippingAddressDto {
    @NotBlank private String fullName;
    @NotBlank private String line1;
    private String line2;
    @NotBlank private String city;
    @NotBlank private String state;
    @NotBlank private String postalCode;
    @NotBlank private String country;
    @NotBlank private String phone;
}
