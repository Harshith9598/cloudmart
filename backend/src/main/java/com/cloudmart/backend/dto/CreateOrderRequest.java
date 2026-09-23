package com.cloudmart.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;

/**
 * Request body for creating an order from the authenticated user's cart. The
 * shipping address is validated as a nested object.
 */
@Getter
@Setter
public class CreateOrderRequest {

    @NotNull(message = "Shipping address is required")
    @Valid
    private ShippingAddressDto shippingAddress;
}
