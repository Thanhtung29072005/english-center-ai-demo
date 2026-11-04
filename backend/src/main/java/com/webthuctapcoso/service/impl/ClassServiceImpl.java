package com.webthuctapcoso.service.impl;
import com.webthuctapcoso.repository.TeacherRepository;
import com.webthuctapcoso.repository.entity.TeacherEntity;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.webthuctapcoso.converter.ClassDTOConverter;
import com.webthuctapcoso.exception.ResourceNotFoundException;
import com.webthuctapcoso.model.ClassDTO;
import com.webthuctapcoso.model.CreateClassRequestDTO;
import com.webthuctapcoso.model.UpdateClassRequestDTO;
import com.webthuctapcoso.repository.BranchRepository;
import com.webthuctapcoso.repository.ClassRepository;
import com.webthuctapcoso.repository.ClassTeacherRepository;
import com.webthuctapcoso.repository.entity.BranchEntity;
import com.webthuctapcoso.repository.entity.ClassEntity;
import com.webthuctapcoso.repository.entity.ClassTeacherEntity;
import com.webthuctapcoso.repository.entity.ClassTeacherId;
import com.webthuctapcoso.service.ClassService;
@Service
public class ClassServiceImpl implements ClassService{
	
	@Autowired
	private BranchRepository branchRepository;
	@Autowired
	private ClassRepository classRepository;
	@Autowired
	private ClassDTOConverter classDTOConverter;
	@Autowired
	private TeacherRepository teacherRepository;
	@Autowired
	private ClassTeacherRepository classTeacherRepository;
	@Override
	public List<ClassDTO> findByBranchId(Integer id) {
		branchRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
		List<ClassEntity> classEntities = classRepository.findByBranchEntityId(id);
		List<ClassDTO> result =new ArrayList<>();
		for(ClassEntity x:classEntities) {
			result.add(classDTOConverter.toClassDTO(x));
		}
		return result;
	}
	@Override
	public ClassDTO findById(Integer id) {
		ClassEntity classEntity =classRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Class not found"));
		return classDTOConverter.toClassDTO(classEntity);
	}
	@Override
	@Transactional
	public ClassDTO createClass(CreateClassRequestDTO request) {
		BranchEntity branch=branchRepository.findById(request.getBranchId()).orElseThrow(()-> new ResourceNotFoundException("Branch not found"));
		ClassEntity classEntity=new ClassEntity();
		classEntity.setName(request.getName());
		classEntity.setLevel(request.getLevel());
		if (request.getPrice() != null) {
		    classEntity.setPrice(request.getPrice());
		} else {
		    classEntity.setPrice(java.math.BigDecimal.ZERO);
		}
		classEntity.setIsCompleted(false);
		classEntity.setCreatedAt(LocalDateTime.now());
		classEntity.setBranchEntity(branch);
		ClassEntity saved =classRepository.save(classEntity);
		if(request.getTeacherIds()!=null && !request.getTeacherIds().isEmpty()) {
			for(Integer teacherId :request.getTeacherIds()) {
				TeacherEntity teacher = teacherRepository.findById(teacherId).orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
				ClassTeacherEntity classTeacher = new ClassTeacherEntity();
				ClassTeacherId id =new ClassTeacherId(saved.getId(), teacher.getId());
				classTeacher.setId(id);
				classTeacher.setClassEntity(saved);
				classTeacher.setTeacherEntity(teacher);
				classTeacherRepository.save(classTeacher);
				saved.getClassTeachers().add(classTeacher);
			}
		}
		return classDTOConverter.toClassDTO(saved);
	}
	@Override
	@Transactional
	public ClassDTO updateClass(Integer id,UpdateClassRequestDTO request) {
		ClassEntity classEntity =classRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Class not found"));
		if (request.getBranchId() != null) {
	        BranchEntity branch = branchRepository.findById(request.getBranchId())
	                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
	        classEntity.setBranchEntity(branch);
	    }
		if(request.getName()!=null) {
			classEntity.setName(request.getName());
		}
		if(request.getLevel()!=null) {
			classEntity.setLevel(request.getLevel());
		}
		if (request.getPrice() != null) {
		    classEntity.setPrice(request.getPrice());
		}
		if(request.getIsCompleted()!=null) {
			classEntity.setIsCompleted(request.getIsCompleted());
		}
		ClassEntity updated = classRepository.save(classEntity);
		if(request.getTeacherIds() != null){

		    classTeacherRepository.deleteByClassEntity_Id(id);

		    for(Integer teacherId : request.getTeacherIds()){

		        TeacherEntity teacher = teacherRepository.findById(teacherId)
		                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

		        ClassTeacherEntity ct = new ClassTeacherEntity();

		        ct.setId(new ClassTeacherId(id, teacherId));
		        ct.setClassEntity(classEntity);
		        ct.setTeacherEntity(teacher);

		        classTeacherRepository.save(ct);
		        updated.getClassTeachers().add(ct);
		    }
		}
		return classDTOConverter.toClassDTO(updated);
	}
//	Tí sau khi làm student phải làm lại chỗ này để xóa hết teacher của class đó đi
	@Override
	@Transactional
	public void deleteClass(Integer id) {
		ClassEntity classEntity = classRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Class not found"));
		classTeacherRepository.deleteByClassEntity_Id(id);
		classRepository.delete(classEntity);
		
	}
	@Override
	public List<ClassDTO> findAll() {
		List<ClassDTO> result = new ArrayList<>();
		List<ClassEntity> classEntities = classRepository.findAll();
		for(ClassEntity x:classEntities) {
			result.add(classDTOConverter.toClassDTO(x));
		}
		return result;
	}
	@Override
	public List<ClassDTO> findByTeacherId(Integer teacherId) {
		TeacherEntity teacher = teacherRepository.findById(teacherId).orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
		List<ClassDTO> result = new ArrayList<>();
		List<ClassTeacherEntity> classTeacherEntities = classTeacherRepository.findByTeacherEntity_Id(teacherId);
		for(ClassTeacherEntity ct : classTeacherEntities) {
			result.add(classDTOConverter.toClassDTO(ct.getClassEntity()));
		}
		return result;
	}
	@Override
	public void assignTeacher(Integer classId, Integer teacherId) {
		ClassEntity classEntity = classRepository.findById(classId).orElseThrow(() -> new ResourceNotFoundException("Class not found"));
		TeacherEntity teacher = teacherRepository.findById(teacherId).orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
		Optional<ClassTeacherEntity> existing=classTeacherRepository.findById(new ClassTeacherId(classId, teacherId));
		if(existing.isPresent()) {
			throw new ResourceNotFoundException("Teacher already assigned to this class");
		}
		ClassTeacherEntity classTeacher = new ClassTeacherEntity();
		classTeacher.setId(new ClassTeacherId(classId, teacherId));
		classTeacher.setClassEntity(classEntity);
		classTeacher.setTeacherEntity(teacher);
		classTeacherRepository.save(classTeacher);
		
	}
	@Override
	public void removeTeacher(Integer classId, Integer teacherId) {
		ClassTeacherEntity classTeacher = classTeacherRepository.findById(new ClassTeacherId(classId, teacherId)).orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
		classTeacherRepository.delete(classTeacher);
		
	}
	
}

