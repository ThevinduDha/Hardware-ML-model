package com.athukorala.inventory_system.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String message;

    private String targetRole;

    private LocalDateTime createdAt;

    private LocalDate startDate;
    private LocalDate expiryDate;

    private boolean urgent;
    private boolean active;

    @Column(length = 1000)
    private String imageUrl; // 🔥 important
}