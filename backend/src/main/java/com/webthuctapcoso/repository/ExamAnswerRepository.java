package com.webthuctapcoso.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.webthuctapcoso.repository.entity.ExamAnswerEntity;

@Repository
public interface ExamAnswerRepository extends JpaRepository<ExamAnswerEntity, Integer> {
	List<ExamAnswerEntity> findByAttemptEntity_Id(Integer attemptId);
	Optional<ExamAnswerEntity> findByAttemptEntity_IdAndQuestionEntity_Id(Integer attemptId, Integer questionId);
	void deleteByAttemptEntity_Id(Integer attemptId);
}
