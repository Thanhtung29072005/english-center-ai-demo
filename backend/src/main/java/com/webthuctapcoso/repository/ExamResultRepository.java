package com.webthuctapcoso.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.webthuctapcoso.repository.entity.ExamResultEntity;
import java.util.*;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResultEntity, Integer> {
	List<ExamResultEntity> findByExamEntity_Id(Integer examId);
	List<ExamResultEntity> findByStudentEntity_Id(Integer studentId);
	@Query("select er from ExamResultEntity er where er.studentEntity.id in :studentIds")
	List<ExamResultEntity> findByStudentIds(@Param("studentIds") Collection<Integer> studentIds);
	Optional<ExamResultEntity> findByExamEntity_IdAndStudentEntity_Id(Integer examId, Integer studentId);
	
}
