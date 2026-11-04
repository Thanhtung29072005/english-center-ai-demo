package com.webthuctapcoso.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.webthuctapcoso.repository.entity.ExamEntity;
import java.util.*;
@Repository
public interface ExamRepository extends JpaRepository<ExamEntity, Integer> {
	List<ExamEntity> findByClassEntity_IdOrderByExamDateDesc(Integer classId);
	boolean existsByClassEntity_IdAndExamDateAndExamType(Integer classId, java.time.LocalDate examDate, String examType);
	List<ExamEntity> findByClassEntity_Id(Integer classId);
	List<ExamEntity> findByClassEntity_IdAndStatusOrderByExamDateDesc(Integer classId, String status);
	List<ExamEntity> findByTeacherEntity_Id(Integer teacherId);
}
