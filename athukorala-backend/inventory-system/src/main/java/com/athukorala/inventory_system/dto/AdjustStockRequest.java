package com.athukorala.inventory_system.dto;

import lombok.Data;

@Data
public class AdjustStockRequest {
    private Long productId;
    private Integer quantityChange;
    private String reason;
    private String note;
    private String referenceCode;
}
