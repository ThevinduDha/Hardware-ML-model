package com.athukorala.inventory_system.service;

import com.athukorala.inventory_system.entity.Role;
import com.athukorala.inventory_system.entity.User;
import com.athukorala.inventory_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerCustomer(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("IDENTIFIER CONFLICT: EMAIL ALREADY REGISTERED");
        }

        user.setRole(Role.CUSTOMER);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User createInternalUser(User user, Role role) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("IDENTIFIER CONFLICT: EMAIL ALREADY REGISTERED");
        }

        user.setRole(role);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            throw new RuntimeException("INVALID IDENTIFIER OR ACCESS KEY");
        }

        User user = userOptional.get();

        // Only use password encoder for verification
        if (passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }

        throw new RuntimeException("INVALID IDENTIFIER OR ACCESS KEY");
    }

    public void changePassword(Long userId, String currentPassword, String newPassword, String confirmNewPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("USER NOT FOUND"));

        // Validation
        if (currentPassword == null || currentPassword.isBlank()) {
            throw new RuntimeException("CURRENT PASSWORD IS REQUIRED");
        }

        if (newPassword == null || newPassword.isBlank()) {
            throw new RuntimeException("NEW PASSWORD IS REQUIRED");
        }

        if (newPassword.length() < 6) {
            throw new RuntimeException("NEW PASSWORD MUST BE AT LEAST 6 CHARACTERS");
        }

        if (!newPassword.equals(confirmNewPassword)) {
            throw new RuntimeException("NEW PASSWORD AND CONFIRM PASSWORD DO NOT MATCH");
        }

        // Verify current password using encoder only
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("CURRENT PASSWORD IS INCORRECT");
        }

        // Update with new encrypted password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // ================= OPTIONAL: MIGRATION UTILITY =================
    // Run this once to migrate any remaining plain-text passwords
    public void migratePlainTextPasswords() {
        Iterable<User> allUsers = userRepository.findAll();
        int migratedCount = 0;

        for (User user : allUsers) {
            String currentPwd = user.getPassword();

            // Check if password is not already BCrypt encoded
            // BCrypt hashes start with "$2a$", "$2b$", or "$2y$"
            if (currentPwd != null && !currentPwd.startsWith("$2")) {
                // This is likely plain text - encode it
                user.setPassword(passwordEncoder.encode(currentPwd));
                userRepository.save(user);
                migratedCount++;
            }
        }

        System.out.println("Migrated " + migratedCount + " plain-text passwords to BCrypt");
    }
}