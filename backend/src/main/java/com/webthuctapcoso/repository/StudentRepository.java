package com.webthuctapcoso.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.*;
import com.webthuctapcoso.repository.entity.StudentEntity;

public interface StudentRepository extends JpaRepository<StudentEntity, Integer> {
	List<StudentEntity> findByClassEntity_Id(Integer classId);
	List<StudentEntity> findByStudentParents_ParentUserId(Integer parentId);
	List<StudentEntity> findByClassEntity_IdAndNameAndDateOfBirth(Integer classId, String name, LocalDate dateOfBirth);
	Optional<StudentEntity> findFirstByNameIgnoreCase(String name);
}
