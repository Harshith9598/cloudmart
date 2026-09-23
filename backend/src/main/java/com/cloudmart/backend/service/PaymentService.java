package com.cloudmart.backend.service;

import com.cloudmart.backend.dto.CreatePaymentRequest;
import com.cloudmart.backend.dto.PaymentDto;
import com.cloudmart.backend.entity.Order;
import com.cloudmart.backend.entity.Payment;
import com.cloudmart.backend.exception.ResourceNotFoundException;
import com.cloudmart.backend.mapper.PaymentMapper;
import com.cloudmart.backend.repository.OrderRepository;
import com.cloudmart.backend.repository.PaymentRepository;
import com.cloudmart.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final PaymentMapper paymentMapper;

    @Transactional
    public PaymentDto createPayment(CreatePaymentRequest req) {
        Order order = orderRepository.findById(req.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotal());
        payment.setCurrency("USD");
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setProvider(req.getProvider());
        payment = paymentRepository.save(payment);

        // In a real implementation, this would call the Stripe/PayPal API here.
        // For now, mark as succeeded immediately.
        payment.setStatus(Payment.PaymentStatus.SUCCEEDED);
        payment.setProviderPaymentId("pi_mock_" + payment.getId());
        payment.setProcessedAt(java.time.Instant.now());
        order.setStatus(Order.OrderStatus.PAID);
        order.setPaymentId(payment.getId());
        order.setPaidAt(java.time.Instant.now());
        orderRepository.save(order);
        payment = paymentRepository.save(payment);

        log.info("Payment processed: {} for order {}", payment.getId(), order.getOrderNumber());
        return paymentMapper.toDto(payment);
    }

    @Transactional(readOnly = true)
    public PaymentDto getPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        return paymentMapper.toDto(payment);
    }

    @Transactional(readOnly = true)
    public PaymentDto getPaymentByOrder(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order"));
        return paymentMapper.toDto(payment);
    }
}
