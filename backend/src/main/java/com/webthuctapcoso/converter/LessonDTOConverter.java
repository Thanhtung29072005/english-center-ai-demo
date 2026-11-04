package com.webthuctapcoso.converter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.List;
import com.webthuctapcoso.repository.valueObjects.VocabularyItem;
import com.webthuctapcoso.repository.valueObjects.HomeworkItem;
import com.webthuctapcoso.repository.valueObjects.GrammarItem;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.webthuctapcoso.model.LessonDTO;
import com.webthuctapcoso.repository.entity.LessonEntity;

@Component
public class LessonDTOConverter {
	@Autowired
	private ObjectMapper objectMapper;
	
	public LessonDTO toLessonDTO(LessonEntity lessonEntity) {
		LessonDTO dto = new LessonDTO();
		dto.setId(lessonEntity.getId());
		dto.setLessonDate(lessonEntity.getLessonDate());
		dto.setLessonNumber(lessonEntity.getLessonNumber());
		dto.setContent(lessonEntity.getContent());
		dto.setGeneralComment(lessonEntity.getGeneralComment());
		dto.setMaterialFileName(lessonEntity.getMaterialFileName());
		dto.setMaterialFileUrl(lessonEntity.getMaterialFileUrl());
		dto.setMaterialUploadedAt(lessonEntity.getMaterialUploadedAt());
		dto.setCreatedAt(lessonEntity.getCreatedAt());
		dto.setClassId(lessonEntity.getClassEntity().getId());
		dto.setTeacherId(lessonEntity.getTeacherEntity().getId());
		dto.setClassName(lessonEntity.getClassEntity().getName());
		dto.setTeacherName(lessonEntity.getTeacherEntity().getName());
		try {
			if (lessonEntity.getVocabulary() != null) {
			    dto.setVocabulary(objectMapper.readValue(
			        lessonEntity.getVocabulary(), 
			        new TypeReference<List<VocabularyItem>>() {} 
			    ));
			}
			if (lessonEntity.getHomework() != null) {
			    dto.setHomework(objectMapper.readValue(
			        lessonEntity.getHomework(), 
			        new TypeReference<List<HomeworkItem>>() {} 
			    ));
			}
			if (lessonEntity.getGrammar() != null) {
			    dto.setGrammar(objectMapper.readValue(
			        lessonEntity.getGrammar(), 
			        new TypeReference<List<GrammarItem>>() {} 
			    ));
			}
		}catch (Exception e) {
			throw new RuntimeException("Error converting JSON to List", e);
		}
		return dto;
	}
}
