package com.examly.springapp.service;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    // ✅ Add user with defaults
    public User addUser(User user) {
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        if (user.getStorage_used() < 0) {
            user.setStorage_used(0);
        }
        return userRepository.save(user);
    }

    // ✅ Get all users
    public List<User> getAll() {
        return userRepository.findAll();
    }

    // ✅ Delete user safely
    public String deleteUser(int id) {
        if (!userRepository.existsById(id)) {
            return "User with ID " + id + " not found!";
        }
        userRepository.deleteById(id);
        return "User deleted successfully";
    }
}
