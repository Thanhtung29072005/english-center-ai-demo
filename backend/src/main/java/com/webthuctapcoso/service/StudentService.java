package com.webthuctapcoso.service;
import java.util.*;

import com.webthuctapcoso.model.CreateStudentRequestDTO;
import com.webthuctapcoso.model.StudentDTO;
public interface StudentService {
	List<StudentDTO> findAll();
	StudentDTO createStudent(CreateStudentRequestDTO request);
	List<StudentDTO> findByClassId(Integer classId);
	StudentDTO findById(Integer id);
	StudentDTO updateStudent(Integer id, CreateStudentRequestDTO request);
	void deleteStudent(Integer id);
}
