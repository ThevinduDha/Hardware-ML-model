package com.athukorala.inventory_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore; // Use this to prevent infinite loops

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private Double price;
    private Integer stockQuantity;
    private String description;
    private String imageUrl;
    private int reorderLevel;

    // --- ADD THIS SECTION ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    @JsonIgnore // Important: Stops the API from crashing in an infinite loop
    private Supplier supplier;
}