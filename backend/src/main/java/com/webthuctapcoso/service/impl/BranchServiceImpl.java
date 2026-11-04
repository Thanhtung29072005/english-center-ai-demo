package com.webthuctapcoso.service.impl;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.webthuctapcoso.converter.BranchDTOConverter;
import com.webthuctapcoso.model.BranchDTO;
import com.webthuctapcoso.model.BranchRequestDTO;
import com.webthuctapcoso.repository.BranchRepository;
import com.webthuctapcoso.repository.OwnerRepository;
import com.webthuctapcoso.repository.entity.BranchEntity;
import com.webthuctapcoso.service.BranchService;
import com.webthuctapcoso.exception.ResourceNotFoundException;
import com.webthuctapcoso.repository.entity.OwnerEntity;
@Service
public class BranchServiceImpl implements BranchService {
	@Autowired
	private BranchRepository branchRepository;
	@Autowired
	private BranchDTOConverter branchDTOConverter;
	@Autowired
	private OwnerRepository ownerRepository;
	@Override
	public List<BranchDTO> fillAll() {
		List<BranchEntity> branchEntities = branchRepository.findAll();
		List<BranchDTO> result =new ArrayList<>();
		for(BranchEntity x:branchEntities) {
			result.add(branchDTOConverter.toBranchDTO(x));
		}
		return result;
		
	}
	@Override
	public BranchDTO findById(Integer id) {
		BranchEntity branchEntity =branchRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
		return branchDTOConverter.toBranchDTO(branchEntity);
		
	}
	@Override
	public BranchDTO createBranch(BranchRequestDTO branchRequestDTO) {
		OwnerEntity owner;
		if (branchRequestDTO.getOwnerId() != null) {
			owner = ownerRepository.findById(branchRequestDTO.getOwnerId())
					.orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
		} else {
			List<OwnerEntity> owners = ownerRepository.findAll();
			if (owners.isEmpty()) throw new ResourceNotFoundException("No owner found in system");
			owner = owners.get(0);
		}
		BranchEntity branch = new BranchEntity();
		branch.setName(branchRequestDTO.getName());
		branch.setAddress(branchRequestDTO.getAddress());
		branch.setPhone(branchRequestDTO.getPhone());
		branch.setOwner(owner);
		branch.setCreatedAt(LocalDateTime.now());
		BranchEntity saved = branchRepository.save(branch);
		return branchDTOConverter.toBranchDTO(saved);
	}
	@Override
	public BranchDTO updateBranch(Integer id, BranchRequestDTO branchRequestDTO) {
		BranchEntity branch = branchRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
		if (branchRequestDTO.getOwnerId() != null) {
			OwnerEntity owner = ownerRepository.findById(branchRequestDTO.getOwnerId())
					.orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
			branch.setOwner(owner);
		}
		branch.setName(branchRequestDTO.getName());
		branch.setAddress(branchRequestDTO.getAddress());
		branch.setPhone(branchRequestDTO.getPhone());
		BranchEntity updated = branchRepository.save(branch);
		return branchDTOConverter.toBranchDTO(updated);
	}
	@Override
	public void deleteBranch(Integer id) {
		BranchEntity branch = branchRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

	    branchRepository.delete(branch);
	}
	
}
