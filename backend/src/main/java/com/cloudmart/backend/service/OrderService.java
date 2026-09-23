package com.cloudmart.backend.service;

import com.cloudmart.backend.dto.*;
import com.cloudmart.backend.entity.*;
import com.cloudmart.backend.exception.BadRequestException;
import com.cloudmart.backend.exception.ForbiddenException;
import com.cloudmart.backend.exception.ResourceNotFoundException;
import com.cloudmart.backend.mapper.OrderMapper;
import com.cloudmart.backend.repository.*;
import com.cloudmart.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;
    private final OrderMapper orderMapper;

    @Transactional(readOnly = true)
    public PaginatedResponse<OrderDto> listOrders(Order.OrderStatus status, Pageable pageable) {
        Long userId = SecurityUtils.getCurrentUserId();
        Page<Order> page;
        if (status != null) {
            page = orderRepository.findByStatus(status, pageable);
        } else {
            page = orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        }
        return PaginatedResponse.from(page.map(orderMapper::toDto));
    }

    @Transactional
    public OrderDto createOrder(CreateOrderRequest req) {
        Long userId = SecurityUtils.getCurrentUserId();
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUser(cart.getUser());
        order.setStatus(Order.OrderStatus.PENDING);

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + product.getName());
            }

            BigDecimal itemSubtotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            subtotal = subtotal.add(itemSubtotal);

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(product);
            oi.setProductName(product.getName());
            oi.setProductImage(product.getImages().isEmpty() ? null : product.getImages().get(0).getUrl());
            oi.setPrice(product.getPrice());
            oi.setQuantity(cartItem.getQuantity());
            oi.setSubtotal(itemSubtotal);
            orderItems.add(oi);

            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        order.setItems(orderItems);
        order.setSubtotal(subtotal);
        order.setShippingCost(subtotal.compareTo(BigDecimal.valueOf(50)) >= 0 ? BigDecimal.ZERO : BigDecimal.valueOf(9.99));
        order.setTax(subtotal.multiply(BigDecimal.valueOf(0.08)));
        order.setTotal(subtotal.add(order.getShippingCost()).add(order.getTax()));

        Order.ShippingAddress addr = new Order.ShippingAddress();
        ShippingAddressDto src = req.getShippingAddress();
        addr.setFullName(src.getFullName());
        addr.setLine1(src.getLine1());
        addr.setLine2(src.getLine2());
        addr.setCity(src.getCity());
        addr.setState(src.getState());
        addr.setPostalCode(src.getPostalCode());
        addr.setCountry(src.getCountry());
        addr.setPhone(src.getPhone());
        order.setShippingAddress(addr);

        order = orderRepository.save(order);
        cartService.clearCart();

        log.info("Order created: {} for user {}", order.getOrderNumber(), userId);
        return orderMapper.toDto(order);
    }

    @Transactional(readOnly = true)
    public OrderDto getOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        verifyAccess(order);
        return orderMapper.toDto(order);
    }

    @Transactional
    public OrderDto cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        verifyAccess(order);
        if (order.getStatus() != Order.OrderStatus.PENDING && order.getStatus() != Order.OrderStatus.PAID) {
            throw new BadRequestException("Cannot cancel order in status: " + order.getStatus());
        }
        order.setStatus(Order.OrderStatus.CANCELLED);
        order = orderRepository.save(order);
        return orderMapper.toDto(order);
    }

    private void verifyAccess(Order order) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (SecurityUtils.isAdmin()) return;
        if (!order.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Access denied");
        }
    }

    private String generateOrderNumber() {
        int year = Instant.now().atZone(java.time.ZoneId.systemDefault()).getYear();
        return "CM-" + year + "-" + String.format("%04d", orderRepository.count() + 1);
    }
}
