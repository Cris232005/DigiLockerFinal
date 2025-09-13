package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;

import com.examly.springapp.model.Document;
import com.examly.springapp.model.Folder;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.DocumentRepository;
import com.examly.springapp.repository.FolderRepository;
import com.examly.springapp.repository.UserRepository;

@RestController
@RequestMapping("/folder")
public class FolderController {
    @Autowired
    private FolderRepository folRepo;

    @Autowired
    private DocumentRepository docRepo;

    @Autowired
    private UserRepository useRepo;


    @PostMapping("/add/{id}")
    public Folder addFolder(@PathVariable int id,@RequestBody Folder fold){
        User use = useRepo.findById(id).orElseThrow(()-> new RuntimeException("User not found"));
        fold.setUser(use);
        return folRepo.save(fold);
    }

    @GetMapping("/get/{id}")
    public List<Folder> getByUserId(@PathVariable int id){
        User ds = useRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("cant find id "+id));

        return ds.getFolders();
    }

    @GetMapping("/get/doc/{fid}")
    public List<Document> getByFolderId(@PathVariable int fid){
        Folder ds = folRepo.findById(fid)
        .orElseThrow(() -> new RuntimeException("cant find id "+fid));

        return ds.getDocs();
    }
    
    @DeleteMapping("/del/{id}")
    public String deleteById(@PathVariable int id){
        folRepo.deleteById(id);
        return "Deleted the particular folder";
    }
    
    @GetMapping("/get")
    public List<Folder> getFolders(){
        return folRepo.findAll();
    }

    @PutMapping("/movedoc/{id}/{did}")
    public Document moveDocument(@PathVariable int id,@PathVariable int did){
        Document doc = docRepo.findById(did).orElseThrow(()-> new RuntimeException("doc not find"));
        doc.setUser(null);
        Folder fold= folRepo.findById(id).orElseThrow(()-> new RuntimeException("doc not find"));
        doc.setFolder(fold);
        fold.getDocs().add(doc);
        return docRepo.save(doc);
    }
    @PutMapping("/removedoc/{id}/{did}")
    public Document removeDocument(@PathVariable int id,@PathVariable int did){
        User use = useRepo.findById(id).orElseThrow(()-> new RuntimeException("user not find "+id));
        Document doc = docRepo.findById(did).orElseThrow(()-> new RuntimeException("doc not find "+did));
        doc.setUser(use);
        doc.setFolder(null);
        return docRepo.save(doc);
    }


}
