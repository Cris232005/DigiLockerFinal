package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.*;  

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.UserService;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"}, allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class UserController {
    
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // ✅ Register new user
    @PostMapping("/add")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        if (user.getRole() == null) {
            user.setRole(User.Role.USER);
        }
        if (user.getStorageUsed() == null || user.getStorageUsed() <= 0) {
            user.setStorageUsed(0L);
        }
        User savedUser = userService.addUser(user);
        return ResponseEntity.ok(savedUser);
    }

    // ✅ Get all users with pagination and sorting
    @GetMapping("/get")
    public Page<User> getAll(
            @RequestParam(defaultValue = "0") int page,         // Page number, starts from 0
            @RequestParam(defaultValue = "10") int size,        // Page size
            @RequestParam(defaultValue = "id") String sortBy,   // Sort field
            @RequestParam(defaultValue = "asc") String sortDir  // Sort direction: asc or desc
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return userRepository.findAll(pageable);
    }
 
    // ✅ Login with username/email and password
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String identifier = loginRequest.get("username"); // can be username or email
        String password = loginRequest.get("password");
        
        User u = userRepository.findByUsername(identifier);
        if (u == null) {
            u = userRepository.findByEmail(identifier);
        }
        
        Map<String, Object> response = new HashMap<>();
        if (u != null && userService.checkPassword(password, u.getPasswordHash())) {
            response.put("success", true);
            response.put("id", u.getId());
            response.put("username", u.getUsername());
            response.put("role", u.getRole());
            response.put("storageUsed", u.getStorageUsed());
            response.put("message", "Login successful");
        } else {
            response.put("success", false);
            response.put("message", "Invalid credentials");
        }
        return ResponseEntity.ok(response);
    }

    // ✅ Delete user by ID
    @DeleteMapping("/del/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        String result = userService.deleteUser(id);
        return ResponseEntity.ok(result);
    }

    // ✅ Check login using GET (for testing)
    @GetMapping("/get/email/{email}/{password}")
    public ResponseEntity<Boolean> getByUserEmailPassword(@PathVariable String email, @PathVariable String password) {
        User u = userRepository.findByEmail(email);
        boolean isValid = (u != null && u.getPasswordHash().equals(password));
        return ResponseEntity.ok(isValid);
    }

    // ✅ Get user ID by email
    @GetMapping("/get/id/{email}")
    public ResponseEntity<Long> getByUserEmail(@PathVariable String email) {
        User u = userRepository.findByEmail(email);
        Long userId = (u != null) ? u.getId() : -1L;
        return ResponseEntity.ok(userId);
    }

    // ✅ Update user details
    @PutMapping("/update/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User with id " + id + " not found"));

        if (updatedUser.getName() != null) {
            user.setName(updatedUser.getName());
        }
        if (updatedUser.getEmail() != null) {
            user.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPasswordHash() != null) {
            user.setPasswordHash(updatedUser.getPasswordHash());
        }
        if (updatedUser.getRole() != null) {
            user.setRole(updatedUser.getRole());
        }
        if (updatedUser.getStorageUsed() != null && updatedUser.getStorageUsed() >= 0) {
            user.setStorageUsed(updatedUser.getStorageUsed());
        }

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }
    
    // ✅ Search users by name, username, or email
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        List<User> users = userRepository.findByNameContainingIgnoreCaseOrUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query, query);
        return ResponseEntity.ok(users);
    }
    
    // ✅ Create admin user (temporary endpoint)
    @PostMapping("/create-admin")
    public ResponseEntity<User> createAdmin(@RequestBody User user) {
        user.setRole(User.Role.ADMIN);
        if (user.getStorageUsed() == null || user.getStorageUsed() <= 0) {
            user.setStorageUsed(0L);
        }
        User savedUser = userService.addUser(user);
        return ResponseEntity.ok(savedUser);
    }
}
