package com.phegondev.Phegon.Eccormerce.dto;

import lombok.Data;
import java.util.List;

@Data
public class TossConfirmRequest {
    private String paymentKey;
    private String orderId;
    private Long amount;
    private List<OrderItemRequest> items;
}
