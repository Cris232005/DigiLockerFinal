package com.examly.springapp.model;

import java.time.Instant;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String fileType;
    private int size;
    private int isArchived;
    private String path;
    private Instant uploadTime;

    // Relationships
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-doc")
    private User user;

    @ManyToOne
    @JoinColumn(name = "folder_id")
    @JsonBackReference("folder-doc")
    private Folder folder;

    // ✅ Constructors
    public Document() {}

    public Document(String name, String fileType, int size, int isArchived, String path) {
        this.name = name;
        this.fileType = fileType;
        this.size = size;
        this.isArchived = isArchived;
        this.path = path;
        this.uploadTime = Instant.now(); // auto-set when created
    }

    // ✅ Getters & Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }

    public int getIsArchived() { return isArchived; }
    public void setIsArchived(int isArchived) { this.isArchived = isArchived; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public Instant getUploadTime() { return uploadTime; }
    public void setUploadTime(Instant uploadTime) { this.uploadTime = uploadTime; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Folder getFolder() { return folder; }
    public void setFolder(Folder folder) { this.folder = folder; }
}
