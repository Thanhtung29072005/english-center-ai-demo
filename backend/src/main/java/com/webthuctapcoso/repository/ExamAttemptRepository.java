package com.webthuctapcoso.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.webthuctapcoso.repository.entity.ExamAttemptEntity;

@Repository
public interface ExamAttemptRepository extends JpaRepository<ExamAttemptEntity, Integer> {
	Optional<ExamAttemptEntity> findByExamEntity_IdAndStudentEntity_Id(Integer examId, Integer studentId);
	List<ExamAttemptEntity> findByExamEntity_Id(Integer examId);
	List<ExamAttemptEntity> findByStudentEntity_Id(Integer studentId);
}
