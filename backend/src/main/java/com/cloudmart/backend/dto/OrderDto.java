package com.cloudmart.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter @Setter
public class OrderDto {
    private Long id;
    private String orderNumber;
    private Long userId;
    private List<OrderItemDto> items;
    private BigDecimal subtotal;
    private BigDecimal shippingCost;
    private BigDecimal tax;
    private BigDecimal total;
    private String status;
    private ShippingAddressDto shippingAddress;
    private Long paymentId;
    private String paidAt;
    private String shippedAt;
    private String deliveredAt;
    private String createdAt;
    private String updatedAt;
}
