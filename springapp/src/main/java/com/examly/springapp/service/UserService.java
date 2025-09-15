package com.examly.springapp.service;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ Add user with defaults and password hashing
    public User addUser(User user) {
        if (user.getRole() == null) {
            user.setRole(User.Role.USER);
        }
        if (user.getStorageUsed() == null || user.getStorageUsed() < 0) {
            user.setStorageUsed(0L);
        }
        // Hash password before saving
        if (user.getPasswordHash() != null) {
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        }
        return userRepository.save(user);
    }

    // ✅ Get all users
    public List<User> getAll() {
        return userRepository.findAll();
    }

    // ✅ Delete user safely
    public String deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            return "User with ID " + id + " not found!";
        }
        userRepository.deleteById(id);
        return "User deleted successfully";
    }
    
    // Check password
    public boolean checkPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }
}
