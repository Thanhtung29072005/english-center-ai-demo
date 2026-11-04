package com.webthuctapcoso.service.impl;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import com.webthuctapcoso.repository.entity.ClassEntity;
import com.webthuctapcoso.repository.entity.TeacherEntity;
import com.webthuctapcoso.model.CreateLessonRequestDTO;
import com.webthuctapcoso.model.LessonDTO;
import com.webthuctapcoso.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import com.webthuctapcoso.repository.LessonRepository;
import com.webthuctapcoso.repository.ClassRepository;
import com.webthuctapcoso.repository.TeacherRepository;
import com.webthuctapcoso.converter.LessonDTOConverter;
import com.webthuctapcoso.exception.ResourceNotFoundException;
import com.webthuctapcoso.repository.entity.LessonEntity;
@Service
public class LessonServiceImpl implements LessonService {
	@Autowired
	private LessonRepository lessonRepository;
	@Autowired
	private TeacherRepository teacherRepository;
	@Autowired
	private ClassRepository classRepository;
	@Autowired
	private LessonDTOConverter lessonDTOConverter;
	@Autowired
	private com.fasterxml.jackson.databind.ObjectMapper objectMapper;
	@Override
	public List<LessonDTO> fillAll() {
		List<LessonEntity> lessonEntities = lessonRepository.findAll();
		List<LessonDTO> result= new java.util.ArrayList<>();
		for (LessonEntity lessonEntity : lessonEntities) {
			result.add(lessonDTOConverter.toLessonDTO(lessonEntity));
		}
		return result;
	}

	@Override
	@Transactional
	public LessonDTO createLesson(CreateLessonRequestDTO request) {
		ClassEntity classEntity = classRepository.findById(request.getClassId()).orElseThrow(() -> new RuntimeException("Class not found"));
		TeacherEntity teacherEntity = teacherRepository.findById(request.getTeacherId()).orElseThrow(() -> new RuntimeException("Teacher not found"));
		LessonEntity lessonEntity = new LessonEntity();
		lessonEntity.setClassEntity(classEntity);
		lessonEntity.setTeacherEntity(teacherEntity);
		lessonEntity.setLessonDate(request.getLessonDate());
		lessonEntity.setLessonNumber(request.getLessonNumber());
		lessonEntity.setContent(request.getContent());
		lessonEntity.setGeneralComment(request.getGeneralComment());
		try {
			if(request.getVocabulary() !=null) {
				lessonEntity.setVocabulary(objectMapper.writeValueAsString(request.getVocabulary()));
			}
			if(request.getHomework() !=null) {
				lessonEntity.setHomework(objectMapper.writeValueAsString(request.getHomework()));
			}
			if(request.getGrammar() !=null) {
				lessonEntity.setGrammar(objectMapper.writeValueAsString(request.getGrammar()));
			}
		}catch (Exception e) {
			throw new RuntimeException("Error converting List to JSON", e);
		}
		LessonEntity saved = lessonRepository.save(lessonEntity);
		return lessonDTOConverter.toLessonDTO(saved);
	}

	@Override
	public List<LessonDTO> findByClassEntityId(Integer classId) {
		classRepository.findById(classId).orElseThrow(() -> new ResourceNotFoundException("Class not found"));
		List<LessonEntity> lessonEntities = lessonRepository.findByClassEntityId(classId);
		List<LessonDTO> result= new java.util.ArrayList<>();
		for (LessonEntity lessonEntity : lessonEntities) {
			result.add(lessonDTOConverter.toLessonDTO(lessonEntity));
		}
		return result;
	}

	@Override
	public List<LessonDTO> findRecentLessonsByClassEntityId(Integer classId) {
		classRepository.findById(classId).orElseThrow(() -> new ResourceNotFoundException("Class not found"));
		List<LessonEntity> lessonEntities = lessonRepository.findTop3ByClassEntityIdOrderByLessonDateDescLessonNumberDesc(classId);
		List<LessonDTO> result= new java.util.ArrayList<>();
		for (LessonEntity lessonEntity : lessonEntities) {
			result.add(lessonDTOConverter.toLessonDTO(lessonEntity));
		}
		return result;
	}

	@Override
	public LessonDTO findById(Integer id) {
		LessonEntity entity = lessonRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
	    return lessonDTOConverter.toLessonDTO(entity);
	}

	@Override
	@Transactional
	public LessonDTO updateLesson(Integer id, CreateLessonRequestDTO request) {
		LessonEntity entity = lessonRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
	    
	    entity.setLessonDate(request.getLessonDate());
	    entity.setLessonNumber(request.getLessonNumber());
	    entity.setContent(request.getContent());
	    entity.setGeneralComment(request.getGeneralComment());

	    try {
	        
	        entity.setVocabulary(objectMapper.writeValueAsString(request.getVocabulary()));
	        entity.setHomework(objectMapper.writeValueAsString(request.getHomework()));
	        entity.setGrammar(objectMapper.writeValueAsString(request.getGrammar()));
	    } catch (Exception e) {
	        throw new RuntimeException("Error converting items to JSON", e);
	    }

	    return lessonDTOConverter.toLessonDTO(lessonRepository.save(entity));
	}

	@Override
	@Transactional
	public LessonDTO uploadMaterial(Integer id, MultipartFile file) {
		LessonEntity entity = lessonRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

		if (file == null || file.isEmpty()) {
			throw new RuntimeException("PDF file is required");
		}

		String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "lesson-material.pdf" : file.getOriginalFilename());
		String lowerFileName = originalFileName.toLowerCase();
		String contentType = file.getContentType();
		if (!lowerFileName.endsWith(".pdf") || (contentType != null && !"application/pdf".equalsIgnoreCase(contentType))) {
			throw new RuntimeException("Only PDF files are allowed");
		}

		try {
			Path uploadDir = Paths.get("uploads", "lesson-materials").toAbsolutePath().normalize();
			Files.createDirectories(uploadDir);

			String storedFileName = "lesson-" + id + "-" + UUID.randomUUID() + ".pdf";
			Path targetPath = uploadDir.resolve(storedFileName);
			Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

			entity.setMaterialFileName(originalFileName);
			entity.setMaterialFileUrl("/uploads/lesson-materials/" + storedFileName);
			entity.setMaterialUploadedAt(LocalDateTime.now());
			return lessonDTOConverter.toLessonDTO(lessonRepository.save(entity));
		} catch (IOException e) {
			throw new RuntimeException("Could not store PDF file", e);
		}
	}

	@Override
	@Transactional
	public void deleteLesson(Integer id) {
		LessonEntity entity = lessonRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
	    lessonRepository.delete(entity);
		
	}

}
