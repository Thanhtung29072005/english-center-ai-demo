package com.webthuctapcoso.converter;

import org.springframework.stereotype.Component;

import com.webthuctapcoso.model.ExamAnswerDTO;
import com.webthuctapcoso.model.ExamAttemptDTO;
import com.webthuctapcoso.model.ExamDTO;
import com.webthuctapcoso.model.ExamQuestionDTO;
import com.webthuctapcoso.model.ExamQuestionStudentDTO;
import com.webthuctapcoso.model.ExamResultDTO;
import com.webthuctapcoso.repository.entity.ExamAnswerEntity;
import com.webthuctapcoso.repository.entity.ExamAttemptEntity;
import com.webthuctapcoso.repository.entity.ExamEntity;
import com.webthuctapcoso.repository.entity.ExamQuestionEntity;
import com.webthuctapcoso.repository.entity.ExamResultEntity;

@Component
public class ExamConverter {
	public ExamDTO toDTO(ExamEntity examEntity) {
		ExamDTO dto = new ExamDTO();
        dto.setId(examEntity.getId());
        dto.setClassId(examEntity.getClassEntity().getId());
        dto.setClassName(examEntity.getClassEntity().getName());
        dto.setTeacherId(examEntity.getTeacherEntity().getId());
        dto.setTeacherName(examEntity.getTeacherEntity().getName());
        dto.setExamDate(examEntity.getExamDate());
        dto.setExamType(examEntity.getExamType());
        dto.setTitle(examEntity.getTitle());
        dto.setDescription(examEntity.getDescription());
        dto.setDurationMinutes(examEntity.getDurationMinutes());
        dto.setStartTime(examEntity.getStartTime());
        dto.setEndTime(examEntity.getEndTime());
        dto.setPdfFileName(examEntity.getPdfFileName());
        dto.setPdfFileUrl(examEntity.getPdfFileUrl());
        dto.setPdfUploadedAt(examEntity.getPdfUploadedAt());
        dto.setStatus(examEntity.getStatus());
        dto.setCreatedAt(examEntity.getCreatedAt());
        return dto;
	}
	public ExamQuestionDTO toQuestionDTO(ExamQuestionEntity entity) {
		ExamQuestionDTO dto = new ExamQuestionDTO();
		dto.setId(entity.getId());
		dto.setExamId(entity.getExamEntity().getId());
		dto.setQuestionNumber(entity.getQuestionNumber());
		dto.setCorrectAnswer(entity.getCorrectAnswer());
		dto.setCreatedAt(entity.getCreatedAt());
		return dto;
	}
	public ExamQuestionStudentDTO toStudentQuestionDTO(ExamQuestionEntity entity) {
		ExamQuestionStudentDTO dto = new ExamQuestionStudentDTO();
		dto.setQuestionNumber(entity.getQuestionNumber());
		return dto;
	}
	public ExamAnswerDTO toAnswerDTO(ExamAnswerEntity entity) {
		ExamAnswerDTO dto = new ExamAnswerDTO();
		dto.setId(entity.getId());
		dto.setQuestionNumber(entity.getQuestionEntity().getQuestionNumber());
		dto.setSelectedAnswer(entity.getSelectedAnswer());
		dto.setIsCorrect(entity.getIsCorrect());
		dto.setCreatedAt(entity.getCreatedAt());
		return dto;
	}
	public ExamAttemptDTO toAttemptDTO(ExamAttemptEntity entity) {
		ExamAttemptDTO dto = new ExamAttemptDTO();
		dto.setId(entity.getId());
		dto.setExamId(entity.getExamEntity().getId());
		dto.setStudentId(entity.getStudentEntity().getId());
		dto.setStudentName(entity.getStudentEntity().getName());
		dto.setStartedAt(entity.getStartedAt());
		dto.setSubmittedAt(entity.getSubmittedAt());
		dto.setScore(entity.getScore());
		dto.setStatus(entity.getStatus());
		return dto;
	}
	public ExamResultDTO toResultDTO(ExamResultEntity entity) {
        ExamResultDTO dto = new ExamResultDTO();
        dto.setId(entity.getId());
        dto.setExamId(entity.getExamEntity().getId());
        dto.setExamTitle(entity.getExamEntity().getTitle());
        dto.setExamType(entity.getExamEntity().getExamType());
        dto.setClassName(entity.getExamEntity().getClassEntity().getName());
        dto.setExamDate(entity.getExamEntity().getExamDate());
        dto.setStudentId(entity.getStudentEntity().getId());
        dto.setStudentName(entity.getStudentEntity().getName());
        dto.setSpeakingScore(entity.getSpeakingScore());
        dto.setListeningScore(entity.getListeningScore());
        dto.setReadingWritingScore(entity.getReadingWritingScore());
        dto.setComment(entity.getComment());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
