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

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String storedPassword = user.getPassword();

            // Normal secure login for hashed passwords
            if (passwordEncoder.matches(password, storedPassword)) {
                return user;
            }

            // Temporary migration support for old plain-text passwords already in DB
            if (password.equals(storedPassword)) {
                user.setPassword(passwordEncoder.encode(password));
                userRepository.save(user);
                return user;
            }
        }

        throw new RuntimeException("INVALID IDENTIFIER OR ACCESS KEY");
    }

    public void changePassword(Long userId, String currentPassword, String newPassword, String confirmNewPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("USER NOT FOUND"));

        if (currentPassword == null || currentPassword.isBlank()) {
            throw new RuntimeException("CURRENT PASSWORD IS REQUIRED");
        }

        if (newPassword == null || newPassword.isBlank()) {
            throw new RuntimeException("NEW PASSWORD IS REQUIRED");
        }

        if (newPassword.length() < 6) {
            throw new RuntimeException("NEW PASSWORD MUST BE AT LEAST 6 CHARACTERS");
        }

        if (confirmNewPassword == null || !newPassword.equals(confirmNewPassword)) {
            throw new RuntimeException("NEW PASSWORD AND CONFIRM PASSWORD DO NOT MATCH");
        }

        String storedPassword = user.getPassword();

        boolean currentPasswordCorrect =
                passwordEncoder.matches(currentPassword, storedPassword) ||
                        currentPassword.equals(storedPassword);

        if (!currentPasswordCorrect) {
            throw new RuntimeException("CURRENT PASSWORD IS INCORRECT");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}