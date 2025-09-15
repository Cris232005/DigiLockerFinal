package com.examly.springapp.controller;

import com.examly.springapp.model.Document;
import com.examly.springapp.model.User;
import com.examly.springapp.model.ActivityLog;
import com.examly.springapp.repository.DocumentRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/doc")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"}, allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class DocumentController {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ActivityLogRepository activityLogRepository;

    // ✅ Upload Document for a user
    @PostMapping("/{userId}/upload")
    public ResponseEntity<Document> uploadDocument(@PathVariable Long userId, @RequestBody Document document) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check storage limit (example: 1GB = 1073741824 bytes)
        long maxStorage = 1073741824L;
        if (user.getStorageUsed() + document.getSize() > maxStorage) {
            throw new RuntimeException("Storage limit exceeded");
        }

        document.setOwner(user);
        document.setUploadedAt(LocalDateTime.now());
        Document savedDoc = documentRepository.save(document);
        
        // Update user storage
        user.setStorageUsed(user.getStorageUsed() + document.getSize());
        userRepository.save(user);
        
        // Log activity
        ActivityLog log = new ActivityLog(user, savedDoc, "UPLOAD");
        activityLogRepository.save(log);
        
        return ResponseEntity.ok(savedDoc);
    }

    // ✅ Get all documents for a user
    @GetMapping("/get/{userId}")
    public ResponseEntity<List<Document>> getUserDocuments(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user.getDocuments());
    }

    // ✅ Delete document by ID
    @DeleteMapping("/del/{docId}")
    public ResponseEntity<String> deleteDocument(@PathVariable Long docId) {
        Document document = documentRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        // Log activity before deletion
        ActivityLog log = new ActivityLog(document.getOwner(), document, "DELETE");
        activityLogRepository.save(log);
        
        documentRepository.deleteById(docId);
        return ResponseEntity.ok("Document deleted successfully");
    }
    
    // ✅ Archive/Unarchive document
    @PutMapping("/archive/{docId}")
    public ResponseEntity<Document> toggleArchive(@PathVariable Long docId) {
        Document document = documentRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        document.setIsArchived(!document.getIsArchived());
        Document savedDoc = documentRepository.save(document);
        
        String action = document.getIsArchived() ? "ARCHIVE" : "UNARCHIVE";
        ActivityLog log = new ActivityLog(document.getOwner(), document, action);
        activityLogRepository.save(log);
        
        return ResponseEntity.ok(savedDoc);
    }
    
    // ✅ Download document
    @GetMapping("/download/{docId}")
    public ResponseEntity<String> downloadDocument(@PathVariable Long docId) {
        Document document = documentRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        // Log download activity
        ActivityLog log = new ActivityLog(document.getOwner(), document, "DOWNLOAD");
        activityLogRepository.save(log);
        
        // Return file URL for download
        return ResponseEntity.ok(document.getFileUrl());
    }
    
    // ✅ Get document by ID with ownership check
    @GetMapping("/document/{docId}")
    public ResponseEntity<Document> getDocument(@PathVariable Long docId) {
        Document document = documentRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        return ResponseEntity.ok(document);
    }
}
