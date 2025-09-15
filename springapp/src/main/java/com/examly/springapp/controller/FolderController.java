package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;
import java.util.*;

import com.examly.springapp.model.Document;
import com.examly.springapp.model.Folder;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.DocumentRepository;
import com.examly.springapp.repository.FolderRepository;
import com.examly.springapp.repository.UserRepository;

@RestController
@RequestMapping("/folder")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"}, allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class FolderController {
    @Autowired
    private FolderRepository folderRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;


    @PostMapping("/add/{id}")
    public ResponseEntity<Folder> addFolder(@PathVariable Long id, @RequestBody Folder folder){
        User user = userRepository.findById(id).orElseThrow(()-> new RuntimeException("User not found"));
        folder.setOwner(user);
        Folder savedFolder = folderRepository.save(folder);
        return ResponseEntity.ok(savedFolder);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<List<Folder>> getByUserId(@PathVariable Long id){
        User user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found: "+id));

        return ResponseEntity.ok(user.getFolders());
    }

    @GetMapping("/get/doc/{fid}")
    public ResponseEntity<List<Document>> getByFolderId(@PathVariable Long fid){
        Folder folder = folderRepository.findById(fid)
        .orElseThrow(() -> new RuntimeException("Folder not found: "+fid));

        return ResponseEntity.ok(folder.getDocuments());
    }
    
    @DeleteMapping("/del/{id}")
    public ResponseEntity<String> deleteById(@PathVariable Long id){
        if (!folderRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("Folder not found");
        }
        folderRepository.deleteById(id);
        return ResponseEntity.ok("Folder deleted successfully");
    }
    
    @GetMapping("/get")
    public ResponseEntity<List<Folder>> getFolders(){
        return ResponseEntity.ok(folderRepository.findAll());
    }

    @PutMapping("/movedoc/{folderId}/{docId}")
    public ResponseEntity<Document> moveDocument(@PathVariable Long folderId, @PathVariable Long docId){
        Document document = documentRepository.findById(docId)
                .orElseThrow(()-> new RuntimeException("Document not found"));
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(()-> new RuntimeException("Folder not found"));
        
        document.setParentFolder(folder);
        Document savedDoc = documentRepository.save(document);
        return ResponseEntity.ok(savedDoc);
    }
    
    @PutMapping("/removedoc/{userId}/{docId}")
    public ResponseEntity<Document> removeDocument(@PathVariable Long userId, @PathVariable Long docId){
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new RuntimeException("User not found: "+userId));
        Document document = documentRepository.findById(docId)
                .orElseThrow(()-> new RuntimeException("Document not found: "+docId));
        
        document.setOwner(user);
        document.setParentFolder(null);
        Document savedDoc = documentRepository.save(document);
        return ResponseEntity.ok(savedDoc);
    }

    // Create subfolder
    @PostMapping("/subfolder/{parentId}")
    public ResponseEntity<Folder> createSubfolder(@PathVariable Long parentId, @RequestBody Folder subfolder) {
        Folder parentFolder = folderRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("Parent folder not found"));
        
        subfolder.setParentFolder(parentFolder);
        subfolder.setOwner(parentFolder.getOwner());
        Folder savedFolder = folderRepository.save(subfolder);
        return ResponseEntity.ok(savedFolder);
    }
}
