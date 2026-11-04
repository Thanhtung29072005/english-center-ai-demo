package com.webthuctapcoso.converter;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.webthuctapcoso.model.StudentDTO;

import com.webthuctapcoso.repository.entity.StudentEntity;
@Component
public class StudentDTOConverter {
	@Autowired
	private ModelMapper modelMapper;
	
	public StudentDTO toStudentDTO(StudentEntity studentEntity) {
		StudentDTO dto =modelMapper.map(studentEntity, StudentDTO.class);
		if (studentEntity.getClassEntity() != null) {
			dto.setClassId(studentEntity.getClassEntity().getId());
			dto.setClassName(studentEntity.getClassEntity().getName());
		}
		
		return dto;
		
	}
	
	
}
