package com.cloudmart.backend.controller;

import com.cloudmart.backend.dto.CreatePaymentRequest;
import com.cloudmart.backend.dto.PaymentDto;
import com.cloudmart.backend.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Payment processing")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @Operation(summary = "Initiate a payment for an order")
    public ResponseEntity<PaymentDto> createPayment(@Valid @RequestBody CreatePaymentRequest req) {
        return ResponseEntity.ok(paymentService.createPayment(req));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a payment by ID")
    public ResponseEntity<PaymentDto> getPayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPayment(id));
    }

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get payment for an order")
    public ResponseEntity<PaymentDto> getPaymentByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.getPaymentByOrder(orderId));
    }
}
