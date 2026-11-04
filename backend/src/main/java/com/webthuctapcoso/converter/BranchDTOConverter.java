package com.webthuctapcoso.converter;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.webthuctapcoso.repository.entity.BranchEntity;
import com.webthuctapcoso.model.BranchDTO;
@Component
public class BranchDTOConverter {
	@Autowired
	private ModelMapper modelMapper;
	public BranchDTO toBranchDTO(BranchEntity branchEntity) {
		BranchDTO branchDTO = modelMapper.map(branchEntity, BranchDTO.class);
		branchDTO.setOwnerId(branchEntity.getOwner().getId());
		branchDTO.setOwnerName(branchEntity.getOwner().getName());
		return branchDTO;
	}
}
