package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.Product;
import com.athukorala.inventory_system.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/add")
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        product.setName(productDetails.getName());
        product.setCategory(productDetails.getCategory());
        product.setPrice(productDetails.getPrice());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setDescription(productDetails.getDescription());
        product.setImageUrl(productDetails.getImageUrl());

        return productRepository.save(product);
    }

    @GetMapping("/low-stock")
    public List<Product> getLowStockProducts() {
        // We filter for items with 10 or fewer units
        return productRepository.findAll()
                .stream()
                .filter(p -> p.getStockQuantity() <= 10)
                .toList();
    }
    // Add this inside your ProductController class
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }
}