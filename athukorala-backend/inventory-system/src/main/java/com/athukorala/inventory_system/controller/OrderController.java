package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.Order;
import com.athukorala.inventory_system.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public Order processCheckout(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        String address = payload.get("address").toString();
        String phone = payload.get("phone").toString();
        Double total = Double.valueOf(payload.get("total").toString());

        return orderService.finalizeOrder(userId, address, phone, total);
    }
}