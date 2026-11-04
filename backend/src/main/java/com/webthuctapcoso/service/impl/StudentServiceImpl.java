package com.webthuctapcoso.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.webthuctapcoso.converter.StudentDTOConverter;
import com.webthuctapcoso.exception.ResourceNotFoundException;
import com.webthuctapcoso.model.CreateStudentRequestDTO;
import com.webthuctapcoso.model.StudentDTO;
import com.webthuctapcoso.repository.ClassRepository;
import com.webthuctapcoso.repository.StudentRepository;
import com.webthuctapcoso.repository.entity.ClassEntity;
import com.webthuctapcoso.repository.entity.StudentEntity;
import com.webthuctapcoso.service.StudentService;

@Service
public class StudentServiceImpl implements StudentService {
	@Autowired
	private StudentRepository studentRepository;
	@Autowired
	private StudentDTOConverter studentDTOConverter;
	@Autowired
	private ClassRepository classRepository;
	@Override
	public List<StudentDTO> findAll() {
		List<StudentEntity> studentEntities = studentRepository.findAll();
		List<StudentDTO> result = new ArrayList<>();
		for(StudentEntity studentEntity :studentEntities) {
			StudentDTO dto = studentDTOConverter.toStudentDTO(studentEntity);
			result.add(dto);
		}
		return result;
	}
	@Override
	public StudentDTO createStudent(CreateStudentRequestDTO request) {
		ClassEntity classEntity = classRepository.findById(request.getClassId()).orElseThrow(() -> new RuntimeException("Class not found"));
		StudentEntity studentEntity = new StudentEntity();

	    studentEntity.setName(request.getName());
	    studentEntity.setDateOfBirth(request.getDateOfBirth());
	    studentEntity.setParentName(request.getParentName());
	    studentEntity.setParentPhone(request.getParentPhone());
	    studentEntity.setParentEmail(request.getParentEmail());

	    studentEntity.setClassEntity(classEntity);

	    StudentEntity savedStudent = studentRepository.save(studentEntity);

	    return studentDTOConverter.toStudentDTO(savedStudent);
	}
	@Override
	public List<StudentDTO> findByClassId(Integer classId) {
		List<StudentEntity> studentEntities = studentRepository.findByClassEntity_Id(classId);
		List<StudentDTO> result = new ArrayList<>();
		for(StudentEntity studentEntity :studentEntities) {
			StudentDTO dto = studentDTOConverter.toStudentDTO(studentEntity);
			result.add(dto);
		}
		return result;
	}
	@Override
	public StudentDTO findById(Integer id) {
		StudentEntity studentEntity = studentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Student not found"));
		return studentDTOConverter.toStudentDTO(studentEntity);
	}
	@Override
	public StudentDTO updateStudent(Integer id, CreateStudentRequestDTO request) {
		StudentEntity studentEntity = studentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Student not found"));
		ClassEntity classEntity = classRepository.findById(request.getClassId()).orElseThrow(() -> new ResourceNotFoundException("Class not found"));
		studentEntity.setName(request.getName());
	    studentEntity.setDateOfBirth(request.getDateOfBirth());
	    studentEntity.setParentName(request.getParentName());
	    studentEntity.setParentPhone(request.getParentPhone());
	    studentEntity.setParentEmail(request.getParentEmail());

	    studentEntity.setClassEntity(classEntity);

	    StudentEntity updatedStudent = studentRepository.save(studentEntity);

	    return studentDTOConverter.toStudentDTO(updatedStudent);
	}
	@Override
	public void deleteStudent(Integer id) {
		StudentEntity studentEntity = studentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Student not found"));
		studentRepository.delete(studentEntity);	
	}
	
}
