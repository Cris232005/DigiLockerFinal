package com.examly.springapp.model;

import javax.persistence.*;
import javax.validation.constraints.Email;
import java.util.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String password;

    @Email
    private String email;

    private String role = "USER";
    private int storage_used = 0;

    // ✅ One-to-Many with Document
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-doc")
    private List<Document> documents = new ArrayList<>();  // initialized

    // ✅ One-to-Many with Folder
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("user-folder")
    private List<Folder> folders = new ArrayList<>();

    // ✅ Constructors
    public User() {}

    public User(String name, String email, String password, String role, int storage_used) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.storage_used = storage_used;
    }

    // ✅ Getters & Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public int getStorage_used() { return storage_used; }
    public void setStorage_used(int storage_used) { this.storage_used = storage_used; }

    // ✅ Documents
    public List<Document> getDocuments() { return documents; }
    public void setDocuments(List<Document> documents) { this.documents = documents; }

    // ✅ Folders
    public List<Folder> getFolders() { return folders; }
    public void setFolders(List<Folder> folders) { this.folders = folders; }
}
