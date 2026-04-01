package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.User;
import com.athukorala.inventory_system.entity.Role;
import com.athukorala.inventory_system.service.AuthService;
import com.athukorala.inventory_system.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = authService.login(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            // Using 401 Unauthorized for login failures
            return ResponseEntity.status(401).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody User user) {
        try {
            User registeredUser = authService.registerCustomer(user);
            return ResponseEntity.ok(registeredUser);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            // Using 400 Bad Request for registration conflicts
            return ResponseEntity.status(400).body(response);
        }
    }

    @PostMapping("/admin/create-staff")
    public ResponseEntity<?> createStaff(@RequestBody User user) {
        try {
            User staff = authService.createInternalUser(user, Role.STAFF);
            return ResponseEntity.ok(staff);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    @PostMapping("/admin/create-admin")
    public ResponseEntity<?> createAdmin(@RequestBody User user) {
        try {
            User admin = authService.createInternalUser(user, Role.ADMIN);
            return ResponseEntity.ok(admin);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }
}