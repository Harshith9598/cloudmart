package com.cloudmart.backend.mapper;

import com.cloudmart.backend.dto.OrderDto;
import com.cloudmart.backend.dto.OrderItemDto;
import com.cloudmart.backend.dto.ShippingAddressDto;
import com.cloudmart.backend.entity.Order;
import com.cloudmart.backend.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Manual mapper between {@link Order} entities and {@link OrderDto}. Maps line
 * items, embeds the shipping address, and converts the lifecycle status and
 * timestamps to string representations.
 */
@Component
public class OrderMapper {

    public OrderDto toDto(Order order) {
        if (order == null) {
            return null;
        }

        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());

        if (order.getUser() != null) {
            dto.setUserId(order.getUser().getId());
        }

        if (order.getItems() != null) {
            List<OrderItemDto> itemDtos = order.getItems().stream()
                    .map(this::toOrderItemDto)
                    .collect(Collectors.toList());
            dto.setItems(itemDtos);
        }

        dto.setSubtotal(order.getSubtotal());
        dto.setShippingCost(order.getShippingCost());
        dto.setTax(order.getTax());
        dto.setTotal(order.getTotal());

        if (order.getStatus() != null) {
            dto.setStatus(order.getStatus().name());
        }

        if (order.getShippingAddress() != null) {
            dto.setShippingAddress(toShippingAddressDto(order.getShippingAddress()));
        }

        dto.setPaymentId(order.getPaymentId());

        if (order.getPaidAt() != null) {
            dto.setPaidAt(order.getPaidAt().toString());
        }
        if (order.getShippedAt() != null) {
            dto.setShippedAt(order.getShippedAt().toString());
        }
        if (order.getDeliveredAt() != null) {
            dto.setDeliveredAt(order.getDeliveredAt().toString());
        }
        if (order.getCreatedAt() != null) {
            dto.setCreatedAt(order.getCreatedAt().toString());
        }
        if (order.getUpdatedAt() != null) {
            dto.setUpdatedAt(order.getUpdatedAt().toString());
        }
        return dto;
    }

    private OrderItemDto toOrderItemDto(OrderItem item) {
        OrderItemDto dto = new OrderItemDto();
        dto.setId(item.getId());

        if (item.getProduct() != null) {
            dto.setProductId(item.getProduct().getId());
        }

        dto.setProductName(item.getProductName());
        dto.setProductImage(item.getProductImage());
        dto.setPrice(item.getPrice());
        dto.setQuantity(item.getQuantity());
        dto.setSubtotal(item.getSubtotal());
        return dto;
    }

    private ShippingAddressDto toShippingAddressDto(Order.ShippingAddress address) {
        ShippingAddressDto dto = new ShippingAddressDto();
        dto.setFullName(address.getFullName());
        dto.setLine1(address.getLine1());
        dto.setLine2(address.getLine2());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setPostalCode(address.getPostalCode());
        dto.setCountry(address.getCountry());
        dto.setPhone(address.getPhone());
        return dto;
    }
}
