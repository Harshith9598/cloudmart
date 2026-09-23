package com.cloudmart.backend.service;

import com.cloudmart.backend.dto.AdminStatsDto;
import com.cloudmart.backend.dto.AuditLogDto;
import com.cloudmart.backend.dto.PaginatedResponse;
import com.cloudmart.backend.entity.Order;
import com.cloudmart.backend.mapper.AuditLogMapper;
import com.cloudmart.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final SellerProfileRepository sellerProfileRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;

    @Transactional(readOnly = true)
    public AdminStatsDto getStats() {
        AdminStatsDto stats = new AdminStatsDto();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalSellers(sellerProfileRepository.count());
        stats.setTotalProducts(productRepository.count());
        stats.setTotalOrders(orderRepository.count());
        stats.setPendingOrders(orderRepository.findByStatus(Order.OrderStatus.PENDING, Pageable.ofSize(1)).getTotalElements());

        // Sum of all paid order totals
        BigDecimal revenue = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.PAID || o.getStatus() == Order.OrderStatus.DELIVERED)
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalRevenue(revenue);
        return stats;
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<AuditLogDto> getAuditLogs(Pageable pageable) {
        Page<com.cloudmart.backend.entity.AuditLog> page = auditLogRepository.findAll(pageable);
        return PaginatedResponse.from(page.map(auditLogMapper::toDto));
    }
}
