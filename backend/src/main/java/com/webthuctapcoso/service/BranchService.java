package com.webthuctapcoso.service;

import java.util.List;
import com.webthuctapcoso.model.BranchDTO;
import com.webthuctapcoso.model.BranchRequestDTO;
public interface BranchService {
	List<BranchDTO> fillAll();
	BranchDTO findById(Integer id);
	BranchDTO createBranch(BranchRequestDTO branchRequestDTO);
	BranchDTO updateBranch(Integer id, BranchRequestDTO branchRequestDTO);
	void deleteBranch(Integer id);
}
