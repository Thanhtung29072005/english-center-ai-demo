package com.webthuctapcoso.service;
import java.util.*;

import com.webthuctapcoso.model.CreateTeacherRequestDTO;
import com.webthuctapcoso.model.TeacherDTO;
import com.webthuctapcoso.model.UpdateTeacherRequestDTO;
public interface TeacherService {
	List<TeacherDTO> findAll();
	List<TeacherDTO> findByBranchId(Integer branchId);
	TeacherDTO findById(Integer id);
	TeacherDTO createTeacher(CreateTeacherRequestDTO request);
	TeacherDTO updateTeacher(Integer id,UpdateTeacherRequestDTO request);
	void deleteTeacher(Integer id);
	
}
