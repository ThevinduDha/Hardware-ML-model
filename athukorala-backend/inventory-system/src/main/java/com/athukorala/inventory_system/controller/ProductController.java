package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.Product;
import com.athukorala.inventory_system.entity.AuditLog;
import com.athukorala.inventory_system.repository.ProductRepository;
import com.athukorala.inventory_system.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductRepository productRepository;
    private final AuditLogRepository auditLogRepository;

    @Autowired
    public ProductController(ProductRepository productRepository, AuditLogRepository auditLogRepository) {
        this.productRepository = productRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @PostMapping("/add")
    public Product addProduct(@RequestBody Product product) {
        if (product.getReorderLevel() <= 0) {
            product.setReorderLevel(5);
        }

        Product savedProduct = productRepository.save(product);

        AuditLog log = new AuditLog();
        log.setAction("PRODUCT_CREATION");
        log.setPerformedBy("ADMIN");
        log.setDetails("CREATED NEW ASSET: " + product.getName() + " IN CATEGORY: " + product.getCategory());
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);

        return savedProduct;
    }

    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // --- ONLY ONE INSTANCE OF THIS METHOD ---
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found in registry"));
    }

    @GetMapping("/low-stock")
    public List<Product> getLowStockProducts() {
        return productRepository.findAll().stream()
                .filter(product -> {
                    Integer stock = product.getStockQuantity();
                    return stock != null && stock <= product.getReorderLevel();
                })
                .collect(Collectors.toList());
    }

    @PatchMapping("/{id}/adjust-stock")
    public Product adjustStock(@PathVariable Long id, @RequestBody java.util.Map<String, Object> payload) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        int amount = Integer.parseInt(payload.get("amount").toString());
        String adminName = payload.getOrDefault("adminName", "System Admin").toString();

        product.setStockQuantity(product.getStockQuantity() + amount);
        Product savedProduct = productRepository.save(product);

        AuditLog log = new AuditLog();
        log.setAction("STOCK_ADJUSTMENT");
        log.setPerformedBy(adminName);
        log.setDetails("ADJUSTED " + product.getName() + " BY " + amount + " UNITS. NEW TOTAL: " + product.getStockQuantity());
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);

        return savedProduct;
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        AuditLog log = new AuditLog();
        log.setAction("PRODUCT_DELETION");
        log.setPerformedBy("ADMIN");
        log.setDetails("PERMANENTLY REMOVED ASSET: " + product.getName() + " (ID: " + id + ")");
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);

        productRepository.deleteById(id);
    }
}