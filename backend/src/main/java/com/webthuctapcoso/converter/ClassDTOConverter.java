package com.webthuctapcoso.converter;

import org.modelmapper.ModelMapper;
import com.webthuctapcoso.repository.entity.ClassTeacherEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.webthuctapcoso.model.ClassDTO;
import com.webthuctapcoso.model.ClassTeacherDTO;
import com.webthuctapcoso.repository.entity.ClassEntity;
import java.util.*;
@Component
public class ClassDTOConverter {
	@Autowired
	private ModelMapper modelMapper;
	public ClassDTO toClassDTO(ClassEntity classEntity) {
		ClassDTO classDTO =modelMapper.map(classEntity, ClassDTO.class);
		if (classEntity.getBranchEntity() != null) {
		    classDTO.setBranchId(classEntity.getBranchEntity().getId());
		    classDTO.setBranchName(classEntity.getBranchEntity().getName());
		}
		List<ClassTeacherEntity> classTeacherEntities =classEntity.getClassTeachers();
		List<ClassTeacherDTO> classTeacherDTOs = new ArrayList<>();
		if(classTeacherEntities!=null) {
		for(ClassTeacherEntity x:classTeacherEntities) {
			if(x.getTeacherEntity()==null) continue;
			ClassTeacherDTO classTeacherDTO = new ClassTeacherDTO();
			classTeacherDTO.setTeacherId(x.getTeacherEntity().getId());
			classTeacherDTO.setTeacherEmail(x.getTeacherEntity().getEmail());
			classTeacherDTO.setTeacherName(x.getTeacherEntity().getName());
			classTeacherDTOs.add(classTeacherDTO);
		}}
		classDTO.setTeachers(classTeacherDTOs);
		return classDTO;	
	}
}
