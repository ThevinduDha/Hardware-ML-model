package com.athukorala.inventory_system.service;

import com.athukorala.inventory_system.entity.Product;
import com.athukorala.inventory_system.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product adjustStock(Long id, int delta) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found in registry"));

        int newQuantity = product.getStockQuantity() + delta;

        if (newQuantity < 0) {
            throw new RuntimeException("PROTOCOL ERROR: Negative stock not allowed");
        }

        product.setStockQuantity(newQuantity);
        return productRepository.save(product);
    }
}