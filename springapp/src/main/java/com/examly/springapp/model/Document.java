package com.examly.springapp.model;

import java.time.LocalDateTime;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(name = "file_type")
    private String fileType;
    
    @Column(name = "file_url")
    private String fileUrl;
    
    private Long size;
    
    @Column(name = "is_archived")
    private Boolean isArchived = false;
    
    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    // Relationships
    @ManyToOne
    @JoinColumn(name = "owner_id")
    @JsonBackReference("user-doc")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "parent_folder_id")
    @JsonBackReference("folder-doc")
    private Folder parentFolder;

    // ✅ Constructors
    public Document() {
        this.uploadedAt = LocalDateTime.now();
        this.isArchived = false;
    }

    public Document(String name, String fileType, String fileUrl, Long size) {
        this.name = name;
        this.fileType = fileType;
        this.fileUrl = fileUrl;
        this.size = size;
        this.uploadedAt = LocalDateTime.now();
        this.isArchived = false;
    }

    // ✅ Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public Long getSize() { return size; }
    public void setSize(Long size) { this.size = size; }

    public Boolean getIsArchived() { return isArchived; }
    public void setIsArchived(Boolean isArchived) { this.isArchived = isArchived; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public Folder getParentFolder() { return parentFolder; }
    public void setParentFolder(Folder parentFolder) { this.parentFolder = parentFolder; }
}
