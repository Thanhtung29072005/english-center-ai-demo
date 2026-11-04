package com.webthuctapcoso.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;
import com.webthuctapcoso.service.BranchService;
import com.webthuctapcoso.model.BranchDTO;
import com.webthuctapcoso.model.BranchRequestDTO;
@RestController
@RequestMapping("/api/branches")
public class BranchAPI {

    @Autowired 
    private BranchService branchService;

    // GET ALL
    @GetMapping
    public List<BranchDTO> getBranches() {
        return branchService.fillAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public BranchDTO getBranchById(@PathVariable Integer id) {
        return branchService.findById(id);
    }
    @PostMapping
    public BranchDTO createBranch(@RequestBody BranchRequestDTO branchRequestDTO) {
		return branchService.createBranch(branchRequestDTO);	
    }
    @PutMapping("/{id}")
    public BranchDTO updateBranch(@PathVariable Integer id, @ RequestBody BranchRequestDTO branchRequestDTO) {
    	return branchService.updateBranch(id, branchRequestDTO);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBranch(@PathVariable Integer id) {
        branchService.deleteBranch(id);
        return ResponseEntity.noContent().build();
    }
}

