package com.webthuctapcoso.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.webthuctapcoso.repository.entity.ExamQuestionEntity;

@Repository
public interface ExamQuestionRepository extends JpaRepository<ExamQuestionEntity, Integer> {
	List<ExamQuestionEntity> findByExamEntity_IdOrderByQuestionNumberAsc(Integer examId);
	Optional<ExamQuestionEntity> findByExamEntity_IdAndQuestionNumber(Integer examId, Integer questionNumber);
	void deleteByExamEntity_Id(Integer examId);
}
