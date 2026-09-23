package com.cloudmart.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Aggregate platform statistics surfaced to administrators on the admin
 * dashboard.
 */
@Getter
@Setter
public class AdminStatsDto {

    private long totalUsers;
    private long totalSellers;
    private long totalProducts;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long pendingOrders;
}
