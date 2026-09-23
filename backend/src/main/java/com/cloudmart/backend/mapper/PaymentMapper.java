package com.cloudmart.backend.mapper;

import com.cloudmart.backend.dto.PaymentDto;
import com.cloudmart.backend.entity.Payment;
import org.springframework.stereotype.Component;

/**
 * Manual mapper between {@link Payment} entities and {@link PaymentDto}. Converts
 * the payment status enum to its string representation and flattens the
 * associated order's number.
 */
@Component
public class PaymentMapper {

    public PaymentDto toDto(Payment payment) {
        if (payment == null) {
            return null;
        }

        PaymentDto dto = new PaymentDto();
        dto.setId(payment.getId());

        if (payment.getOrder() != null) {
            dto.setOrderId(payment.getOrder().getId());
            dto.setOrderNumber(payment.getOrder().getOrderNumber());
        }

        dto.setAmount(payment.getAmount());
        dto.setCurrency(payment.getCurrency());

        if (payment.getStatus() != null) {
            dto.setStatus(payment.getStatus().name());
        }

        dto.setProvider(payment.getProvider());
        dto.setProviderPaymentId(payment.getProviderPaymentId());

        if (payment.getCreatedAt() != null) {
            dto.setCreatedAt(payment.getCreatedAt().toString());
        }
        if (payment.getProcessedAt() != null) {
            dto.setProcessedAt(payment.getProcessedAt().toString());
        }
        return dto;
    }
}
