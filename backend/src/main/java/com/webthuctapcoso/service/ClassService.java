package com.webthuctapcoso.service;
import java.util.*;
import com.webthuctapcoso.model.ClassDTO;
import com.webthuctapcoso.model.CreateClassRequestDTO;
import com.webthuctapcoso.model.UpdateClassRequestDTO;
public interface ClassService {
	List<ClassDTO> findAll();
	List<ClassDTO> findByBranchId(Integer id);
	ClassDTO findById(Integer id);
	ClassDTO createClass(CreateClassRequestDTO request);
	ClassDTO updateClass(Integer id,UpdateClassRequestDTO request);
	void deleteClass(Integer id);
	List<ClassDTO> findByTeacherId(Integer teacherId);
	void assignTeacher(Integer classId, Integer teacherId);
	void removeTeacher(Integer classId, Integer teacherId);
}
