package com.examly.springapp.model;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.util.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Folder {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;
    private int ownerId;
    private String name;
    private int parentFolderId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-folder")
    private User user;
    
    @OneToMany(mappedBy = "folder",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonManagedReference("folder-doc")
    private List<Document> docs;

    public List<Document> getDocs() {
        return docs;
    }

    public void setDocs(List<Document> docs) {
        this.docs = docs;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Folder(int id, int ownerId, String name, int parentFolderId) {
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
        this.parentFolderId = parentFolderId;
    } 
      
    public Folder() {
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public int getOwnerId() {
        return ownerId;
    }
    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getParentFolderId() {
        return parentFolderId;
    }
    public void setParentFolderId(int parentFolderId) {
        this.parentFolderId = parentFolderId;
    }

    


}
