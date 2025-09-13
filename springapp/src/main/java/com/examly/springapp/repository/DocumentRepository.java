package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.examly.springapp.model.Document;

public interface DocumentRepository extends JpaRepository<Document,Integer> {
    
}
