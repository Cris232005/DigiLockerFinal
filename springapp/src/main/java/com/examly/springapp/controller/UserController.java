package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.*;  

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.UserService;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
public class UserController {
    
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // ✅ Register new user
    @PostMapping("/add")
    public User addUser(@RequestBody User user) {
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        if (user.getStorage_used() <= 0) {
            user.setStorage_used(0);
        }
        return userService.addUser(user);
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

    // ✅ Login
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User loginRequest) {
        User u = userRepository.findByEmail(loginRequest.getEmail());
        Map<String, Object> response = new HashMap<>();

        if (u != null && u.getPassword().equals(loginRequest.getPassword())) {
            response.put("success", true);
            response.put("id", u.getId());
            response.put("role", u.getRole());
            response.put("message", "Login successful");
        } else {
            response.put("success", false);
            response.put("message", "Invalid email or password");
        }
        return response;
    }

    // ✅ Delete user by ID
    @DeleteMapping("/del/{id}")
    public String deleteUser(@PathVariable int id) {
        return userService.deleteUser(id);
    }

    // ✅ Check login using GET (for testing)
    @GetMapping("/get/email/{email}/{password}")
    public boolean getByUserEmailPassword(@PathVariable String email, @PathVariable String password) {
        User u = userRepository.findByEmail(email);
        return (u != null && u.getPassword().equals(password));
    }

    // ✅ Get user ID by email
    @GetMapping("/get/id/{email}")
    public int getByUserEmail(@PathVariable String email) {
        User u = userRepository.findByEmail(email);
        return (u != null) ? u.getId() : -1;
    }

    // ✅ Update user details
    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable int id, @RequestBody User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User with id " + id + " not found"));

        if (updatedUser.getName() != null) {
            user.setName(updatedUser.getName());
        }
        if (updatedUser.getEmail() != null) {
            user.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPassword() != null) {
            user.setPassword(updatedUser.getPassword());
        }
        if (updatedUser.getRole() != null) {
            user.setRole(updatedUser.getRole());
        }
        if (updatedUser.getStorage_used() >= 0) {
            user.setStorage_used(updatedUser.getStorage_used());
        }

        return userRepository.save(user);
    }
}
