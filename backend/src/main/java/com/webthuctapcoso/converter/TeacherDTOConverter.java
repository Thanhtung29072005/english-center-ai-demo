package com.webthuctapcoso.converter;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.webthuctapcoso.model.TeacherDTO;
import com.webthuctapcoso.repository.entity.TeacherEntity;

@Component
public class TeacherDTOConverter {
	@Autowired
	private ModelMapper modelMapper;
	public TeacherDTO toTeacherDTO(TeacherEntity teacherEntity) {
		TeacherDTO dto =modelMapper.map(teacherEntity, TeacherDTO.class);
		if (teacherEntity.getBranch() != null) {
            dto.setBranchId(teacherEntity.getBranch().getId());
            dto.setBranchName(teacherEntity.getBranch().getName());
        }

        return dto;
	}
}
