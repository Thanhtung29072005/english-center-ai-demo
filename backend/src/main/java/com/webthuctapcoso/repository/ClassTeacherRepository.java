package com.webthuctapcoso.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.webthuctapcoso.repository.entity.ClassEntity;
import com.webthuctapcoso.repository.entity.ClassTeacherEntity;
import com.webthuctapcoso.repository.entity.ClassTeacherId;
import java.util.*;
@Repository
public interface ClassTeacherRepository extends JpaRepository<ClassTeacherEntity, ClassTeacherId> {
	List<ClassTeacherEntity> findByClassEntity_Id(Integer classId);
	List<ClassTeacherEntity> findByTeacherEntity_Id(Integer teacherId);
	void deleteByClassEntity_Id(Integer classId);
	void deleteByTeacherEntity_Id(Integer teacherId);
}
