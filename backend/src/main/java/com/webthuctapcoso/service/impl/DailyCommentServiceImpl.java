package com.webthuctapcoso.service.impl;

import org.springframework.stereotype.Service;

import com.webthuctapcoso.service.DailyCommentService;
import java.util.List;

import javax.transaction.Transactional;

import com.webthuctapcoso.model.DailyCommentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import com.webthuctapcoso.repository.DailyCommentRepository;
import com.webthuctapcoso.converter.DailyCommentDTOConverter;
import com.webthuctapcoso.repository.LessonRepository;
import com.webthuctapcoso.repository.entity.DailyCommentEntity;
import com.webthuctapcoso.repository.entity.LessonEntity;
import com.webthuctapcoso.repository.entity.StudentEntity;
import com.webthuctapcoso.exception.ResourceNotFoundException;
import com.webthuctapcoso.repository.StudentRepository;
@Service
public class DailyCommentServiceImpl implements DailyCommentService {
	@Autowired
	private DailyCommentRepository dailyCommentRepository;
	@Autowired
	private DailyCommentDTOConverter dailyCommentDTOConverter;
	@Autowired
	private LessonRepository lessonRepository;
	@Autowired
	private StudentRepository studentRepository;
	@Override
	public List<DailyCommentDTO> getDailyCommentsByLessonId(Integer lessonId) {
		LessonEntity lessonEntity = lessonRepository.findById(lessonId).orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));
		List<DailyCommentEntity> dailyCommentEntities = dailyCommentRepository.findByLessonEntity_Id(lessonId);
		List<DailyCommentDTO> dailyComments = new java.util.ArrayList<>();
		for (DailyCommentEntity entity : dailyCommentEntities) {
			DailyCommentDTO dto = dailyCommentDTOConverter.toDTO(entity);
			dailyComments.add(dto);
		}
		return dailyComments;
	}
	@Override
	public List<DailyCommentDTO> getDailyCommentsByStudentId(Integer studentId) {
		StudentEntity studentEntity = studentRepository.findById(studentId).orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
		List<DailyCommentEntity> dailyCommentEntities = dailyCommentRepository.findByStudentEntity_Id(studentId);
		List<DailyCommentDTO> dailyComments = new java.util.ArrayList<>();
		for (DailyCommentEntity entity : dailyCommentEntities) {
			DailyCommentDTO dto = dailyCommentDTOConverter.toDTO(entity);
			dailyComments.add(dto);
		}
		return dailyComments;
	}
	@Override
    @Transactional
    public DailyCommentDTO createDailyComment(DailyCommentDTO dto) {
       
        if (dailyCommentRepository.existsByLessonEntity_IdAndStudentEntity_Id(dto.getLessonId(), dto.getStudentId())) {
            throw new RuntimeException("Học sinh này đã được chấm điểm cho buổi học này.");
        }

        DailyCommentEntity entity = new DailyCommentEntity();
        LessonEntity lessonEntity = lessonRepository.findById(dto.getLessonId())
				.orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + dto.getLessonId()));
        StudentEntity studentEntity = studentRepository.findById(dto.getStudentId()).orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + dto.getStudentId()));
        entity.setLessonEntity(lessonEntity);
        entity.setStudentEntity(studentEntity);
        entity.setVocabularyScore(dto.getVocabularyScore());
        entity.setSchoolExamScore(dto.getSchoolExamScore());
        entity.setHomeworkStatus(dto.getHomeworkStatus());
        entity.setComment(dto.getComment());
        DailyCommentEntity saved = dailyCommentRepository.save(entity);
        return dailyCommentDTOConverter.toDTO(saved);
    }
	@Override
	public DailyCommentDTO updateDailyComment(Integer id, DailyCommentDTO dailyCommentDTO) {
		DailyCommentEntity entity = dailyCommentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Daily comment not found with id: " + id));
		entity.setVocabularyScore(dailyCommentDTO.getVocabularyScore());
		entity.setSchoolExamScore(dailyCommentDTO.getSchoolExamScore());
		entity.setHomeworkStatus(dailyCommentDTO.getHomeworkStatus());
		entity.setComment(dailyCommentDTO.getComment());
		DailyCommentEntity updated = dailyCommentRepository.save(entity);
		return dailyCommentDTOConverter.toDTO(updated);
	}
	@Override
	public DailyCommentDTO getDailyCommentById(Integer id) {
		DailyCommentEntity entity = dailyCommentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Daily comment not found with id: " + id));
		return dailyCommentDTOConverter.toDTO(entity);
	}
	@Override
	public void deleteDailyComment(Integer id) {
		DailyCommentEntity entity = dailyCommentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Daily comment not found with id: " + id));
		dailyCommentRepository.delete(entity);
		
	}

}
