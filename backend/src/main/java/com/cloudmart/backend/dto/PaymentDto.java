package com.cloudmart.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Public representation of a payment associated with an order, including the
 * external provider's reference identifier.
 */
@Getter
@Setter
public class PaymentDto {

    private Long id;
    private Long orderId;
    private String orderNumber;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String provider;
    private String providerPaymentId;
    private String createdAt;
    private String processedAt;
}
