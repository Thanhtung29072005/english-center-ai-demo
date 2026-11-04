package com.webthuctapcoso.converter;

import org.springframework.stereotype.Component;

import com.webthuctapcoso.model.DailyCommentDTO;
import com.webthuctapcoso.repository.entity.DailyCommentEntity;

@Component
public class DailyCommentDTOConverter {
	public DailyCommentDTO toDTO(DailyCommentEntity entity) {
		DailyCommentDTO dto =new DailyCommentDTO();
		dto.setId(entity.getId());
		dto.setLessonId(entity.getLessonEntity().getId());
		dto.setLessonDate(entity.getLessonEntity().getLessonDate().toString());
		dto.setClassName(entity.getLessonEntity().getClassEntity().getName());
		dto.setStudentId(entity.getStudentEntity().getId());
		dto.setStudentName(entity.getStudentEntity().getName());
		dto.setVocabularyScore(entity.getVocabularyScore());
		dto.setSchoolExamScore(entity.getSchoolExamScore());
		dto.setHomeworkStatus(entity.getHomeworkStatus());
		dto.setComment(entity.getComment());
		dto.setCreatedAt(entity.getCreatedAt());
		return dto;
	}
}
