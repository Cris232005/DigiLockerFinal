package com.examly.springapp.controller;

import com.examly.springapp.model.Document;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.DocumentRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/doc")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend
public class DocumentController {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ Upload Document for a user
    @PostMapping("/{userId}/add")
    public ResponseEntity<Document> addDocument(@PathVariable int userId, @RequestBody Document document) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        document.setUser(user);                 // link doc to user
        document.setUploadTime(Instant.now()); // auto-set time

        Document savedDoc = documentRepository.save(document);
        return ResponseEntity.ok(savedDoc);
    }

    // ✅ Get all documents for a user
    @GetMapping("/get/{userId}")
    public ResponseEntity<List<Document>> getUserDocuments(@PathVariable int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user.getDocuments());
    }

    // ✅ Delete document by ID
    @DeleteMapping("/del/{docId}")
    public ResponseEntity<String> deleteDocument(@PathVariable int docId) {
        if (!documentRepository.existsById(docId)) {
            return ResponseEntity.badRequest().body("Document not found");
        }
        documentRepository.deleteById(docId);
        return ResponseEntity.ok("Document deleted successfully");
    }
}
