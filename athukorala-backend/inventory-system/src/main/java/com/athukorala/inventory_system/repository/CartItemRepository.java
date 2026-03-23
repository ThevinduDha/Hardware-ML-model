package com.athukorala.inventory_system.repository;

import com.athukorala.inventory_system.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    // Find all items in a specific user's shopping cart
    List<CartItem> findByUserId(Long userId);
}