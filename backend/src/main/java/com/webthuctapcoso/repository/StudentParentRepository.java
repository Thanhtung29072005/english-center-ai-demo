package com.webthuctapcoso.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
import com.webthuctapcoso.repository.entity.StudentParentEntity;

public interface StudentParentRepository extends JpaRepository<StudentParentEntity, Integer> {
	List<StudentParentEntity> findByStudentEntity_Id(Integer studentId);
	List<StudentParentEntity> findByParentUserId(Integer parentUserId);
	boolean existsByStudentEntity_IdAndParentUserId(Integer studentId, Integer parentUserId);
	void deleteByStudentEntity_Id(Integer studentId);
	void deleteByParentUserId(Integer parentUserId);
}
