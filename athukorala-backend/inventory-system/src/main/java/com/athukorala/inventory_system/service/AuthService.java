package com.athukorala.inventory_system.service;

import com.athukorala.inventory_system.entity.User;
import com.athukorala.inventory_system.entity.Role;
import com.athukorala.inventory_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User registerCustomer(User user) {
        // --- DUPLICATE IDENTIFIER CHECK ---
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("IDENTIFIER CONFLICT: EMAIL ALREADY REGISTERED");
        }

        user.setRole(Role.CUSTOMER);
        return userRepository.save(user);
    }

    public User createInternalUser(User user, Role role) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("IDENTIFIER CONFLICT: EMAIL ALREADY REGISTERED");
        }

        user.setRole(role);
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        // INDUSTRY STANDARD: Do not reveal if the email or the password was wrong
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (password.equals(user.getPassword())) {
                return user;
            }
        }

        // This unified message matches the security protocol in your AuthPage.jsx
        throw new RuntimeException("INVALID IDENTIFIER OR ACCESS KEY");
    }
}