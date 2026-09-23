package com.cloudmart.backend.controller;

import com.cloudmart.backend.dto.*;
import com.cloudmart.backend.entity.Order;
import com.cloudmart.backend.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order creation and tracking")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(summary = "List current user's orders")
    public ResponseEntity<PaginatedResponse<OrderDto>> listOrders(
            @RequestParam(required = false) Order.OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(orderService.listOrders(status, pageable));
    }

    @PostMapping
    @Operation(summary = "Create an order from the cart")
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody CreateOrderRequest req) {
        return ResponseEntity.ok(orderService.createOrder(req));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single order by ID")
    public ResponseEntity<OrderDto> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrder(id));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel a pending or paid order")
    public ResponseEntity<OrderDto> cancelOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(id));
    }
}
