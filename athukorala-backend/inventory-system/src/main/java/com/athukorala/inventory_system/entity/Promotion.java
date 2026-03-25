package com.athukorala.inventory_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

/**
 * Entity for the Discount & Promotion Management Module[cite: 393].
 * Responsible for storing promotional offers for products or categories[cite: 395].
 */
@Entity
@Table(name = "promotions")
@Data
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private DiscountType type; // Supports PERCENTAGE or FIXED_AMOUNT [cite: 406-408]

    private Double value; // Discount value (e.g., 10 for 10% or 500 for LKR 500 off) [cite: 407-408]

    private LocalDate startDate; // Start date of promotion period [cite: 410]
    private LocalDate endDate; // End date of promotion period [cite: 411]

    private boolean enabled = true; // Manual enable/disable toggle [cite: 412]

    // Links to a specific hardware asset or business category [cite: 405]
    private Long targetId;
    private String targetType; // "PRODUCT" or "CATEGORY"

    // Optional field to match category names exactly
    private String targetCategory;
}