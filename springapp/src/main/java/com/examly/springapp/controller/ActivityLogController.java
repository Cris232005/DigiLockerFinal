package com.examly.springapp.controller;

import com.examly.springapp.model.ActivityLog;
import com.examly.springapp.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@RestController
@RequestMapping("/activity")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"}, allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class ActivityLogController {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ActivityLog>> getUserActivity(@PathVariable Long userId) {
        List<ActivityLog> activities = activityLogRepository.findByUserIdOrderByTimestampDesc(userId);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/document/{docId}")
    public ResponseEntity<List<ActivityLog>> getDocumentActivity(@PathVariable Long docId) {
        List<ActivityLog> activities = activityLogRepository.findByDocumentIdOrderByTimestampDesc(docId);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ActivityLog>> getAllActivities() {
        List<ActivityLog> activities = activityLogRepository.findAll();
        return ResponseEntity.ok(activities);
    }
}