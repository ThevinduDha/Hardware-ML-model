package com.athukorala.inventory_system.service;

import com.athukorala.inventory_system.entity.DiscountType;
import com.athukorala.inventory_system.entity.Product;
import com.athukorala.inventory_system.entity.Promotion;
import com.athukorala.inventory_system.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    public Double calculateDiscountedPrice(Product product) {
        LocalDate today = LocalDate.now();

        // Retrieve promotions and filter based on active status and dates [cite: 434-438, 484]
        List<Promotion> activePromotions = promotionRepository.findAll().stream()
                .filter(p -> p.isEnabled()) // Checks if promotion is active [cite: 438]
                .filter(p -> !today.isBefore(p.getStartDate()) && !today.isAfter(p.getEndDate())) // Date check [cite: 437]
                .filter(p -> {
                    // Check if promotion targets this product or its category [cite: 405, 505]
                    boolean isTargetProduct = "PRODUCT".equalsIgnoreCase(p.getTargetType()) &&
                            p.getTargetId() != null &&
                            p.getTargetId().equals(product.getId());

                    boolean isTargetCategory = "CATEGORY".equalsIgnoreCase(p.getTargetType()) &&
                            p.getTargetType() != null &&
                            product.getCategory().equalsIgnoreCase(p.getTargetType());

                    return isTargetProduct || isTargetCategory;
                })
                .toList();

        if (activePromotions.isEmpty()) {
            return product.getPrice();
        }

        // Apply first found promotion based on business rules [cite: 440-442, 460-462]
        Promotion promo = activePromotions.get(0);

        if (promo.getType() == DiscountType.PERCENTAGE) {
            return product.getPrice() * (1 - (promo.getValue() / 100));
        } else if (promo.getType() == DiscountType.FIXED_AMOUNT) {
            return Math.max(0.0, product.getPrice() - promo.getValue());
        }

        return product.getPrice();
    }
}