package com.athukorala.inventory_system.dto;

import lombok.Data;

@Data
public class ReorderSettingsRequest {
    private Integer reorderLevel;
    private Integer reorderQty;
}
