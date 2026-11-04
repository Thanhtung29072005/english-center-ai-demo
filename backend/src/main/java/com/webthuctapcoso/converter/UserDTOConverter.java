package com.webthuctapcoso.converter;

import org.springframework.stereotype.Component;

import com.webthuctapcoso.model.UserDTO;
import com.webthuctapcoso.repository.entity.UserEntity;

@Component
public class UserDTOConverter {
	public UserDTO toDTO(UserEntity userEntity) {
		UserDTO userDTO = new UserDTO();
		userDTO.setId(userEntity.getId());
		userDTO.setUsername(userEntity.getUsername());
		userDTO.setEmail(userEntity.getEmail());
		userDTO.setFullName(userEntity.getFullName());
		userDTO.setPhone(userEntity.getPhone());
		userDTO.setRole(userEntity.getRole().name());
		userDTO.setIsActive(userEntity.getIsActive());
		userDTO.setCreatedAt(userEntity.getCreatedAt());
		if(userEntity.getBranch() != null) {
			userDTO.setBranchId(userEntity.getBranch().getId());
		}
		if(userEntity.getTeacher() != null) {
			userDTO.setTeacherId(userEntity.getTeacher().getId());
		}
		
		return userDTO;
		
	}
}
