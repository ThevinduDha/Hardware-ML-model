package com.athukorala.inventory_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "suppliers")
@Data
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String contactPerson;
    private String email;
    private String phoneNumber;
    private String category; // e.g., PAINTS, ELECTRICAL

    @OneToMany(mappedBy = "supplier")
    private List<Product> products;
}