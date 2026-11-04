package com.webthuctapcoso.service.impl;

import com.webthuctapcoso.repository.StudentParentRepository;
import com.webthuctapcoso.repository.ClassRepository;
import com.webthuctapcoso.repository.LessonRepository;
import com.webthuctapcoso.repository.DailyCommentRepository;
import com.webthuctapcoso.repository.ExamRepository;
import com.webthuctapcoso.repository.ExamResultRepository;
import com.webthuctapcoso.repository.entity.StudentParentEntity;
import com.webthuctapcoso.repository.entity.ClassEntity;
import com.webthuctapcoso.repository.entity.LessonEntity;
import com.webthuctapcoso.repository.entity.DailyCommentEntity;
import com.webthuctapcoso.repository.entity.ExamEntity;
import com.webthuctapcoso.converter.ClassDTOConverter;
import com.webthuctapcoso.converter.LessonDTOConverter;
import com.webthuctapcoso.converter.DailyCommentDTOConverter;
import com.webthuctapcoso.converter.ExamConverter;
import com.webthuctapcoso.model.ClassDTO;
import com.webthuctapcoso.model.LessonDTO;
import com.webthuctapcoso.model.DailyCommentDTO;
import com.webthuctapcoso.model.ExamDTO;
import com.webthuctapcoso.model.ExamResultDTO;
import com.webthuctapcoso.service.ParentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ParentServiceImpl implements ParentService {
	
	@Autowired
	private StudentParentRepository studentParentRepository;
	@Autowired
	private ClassRepository classRepository;
	@Autowired
	private LessonRepository lessonRepository;
	@Autowired
	private DailyCommentRepository dailyCommentRepository;
	@Autowired
	private ExamRepository examRepository;
	@Autowired
	private ExamResultRepository examResultRepository;
	@Autowired
	private ClassDTOConverter classDTOConverter;
	@Autowired
	private LessonDTOConverter lessonDTOConverter;
	@Autowired
	private DailyCommentDTOConverter dailyCommentDTOConverter;
	@Autowired
	private ExamConverter examConverter;
	
	@Override
	public List<ClassDTO> getClassesByParentUserId(Integer parentUserId) {
		List<StudentParentEntity> studentParents = studentParentRepository.findByParentUserId(parentUserId);
		
		if (studentParents.isEmpty()) {
			return new ArrayList<>();
		}
		
		List<Integer> studentIds = studentParents.stream()
			.map(sp -> sp.getStudentEntity().getId())
			.collect(Collectors.toList());
		
		Set<Integer> classIds = new HashSet<>();
		for (Integer studentId : studentIds) {
			List<ClassEntity> classes = classRepository.findByStudents_Id(studentId);
			for (ClassEntity c : classes) {
				classIds.add(c.getId());
			}
		}
		
		List<ClassDTO> result = new ArrayList<>();
		for (Integer classId : classIds) {
			ClassEntity classEntity = classRepository.findById(classId).orElse(null);
			if (classEntity != null) {
				result.add(classDTOConverter.toClassDTO(classEntity));
			}
		}
		
		return result;
	}
	
	@Override
	public List<LessonDTO> getLessonsByParentUserId(Integer parentUserId) {
		List<StudentParentEntity> studentParents = studentParentRepository.findByParentUserId(parentUserId);
		
		if (studentParents.isEmpty()) {
			return new ArrayList<>();
		}
		
		List<Integer> studentIds = studentParents.stream()
			.map(sp -> sp.getStudentEntity().getId())
			.collect(Collectors.toList());
		
		Set<Integer> classIds = new HashSet<>();
		for (Integer studentId : studentIds) {
			List<ClassEntity> classes = classRepository.findByStudents_Id(studentId);
			for (ClassEntity c : classes) {
				classIds.add(c.getId());
			}
		}
		
		List<LessonDTO> result = new ArrayList<>();
		for (Integer classId : classIds) {
			List<LessonEntity> lessons = lessonRepository.findByClassEntityId(classId);
			for (LessonEntity lesson : lessons) {
				result.add(lessonDTOConverter.toLessonDTO(lesson));
			}
		}
		
		return result;
	}
	
	@Override
	public List<DailyCommentDTO> getReviewsByParentUserId(Integer parentUserId) {
		List<StudentParentEntity> studentParents = studentParentRepository.findByParentUserId(parentUserId);
		
		if (studentParents.isEmpty()) {
			return new ArrayList<>();
		}
		
		List<Integer> studentIds = studentParents.stream()
			.map(sp -> sp.getStudentEntity().getId())
			.collect(Collectors.toList());
		
		List<DailyCommentDTO> result = new ArrayList<>();
		for (Integer studentId : studentIds) {
			List<DailyCommentEntity> comments = dailyCommentRepository.findByStudentEntity_Id(studentId);
			for (DailyCommentEntity comment : comments) {
				result.add(dailyCommentDTOConverter.toDTO(comment));
			}
		}
		
		return result;
	}
	
	@Override
	public List<ExamDTO> getExamsByParentUserId(Integer parentUserId) {
		List<StudentParentEntity> studentParents = studentParentRepository.findByParentUserId(parentUserId);
		
		if (studentParents.isEmpty()) {
			return new ArrayList<>();
		}
		
		List<Integer> studentIds = studentParents.stream()
			.map(sp -> sp.getStudentEntity().getId())
			.collect(Collectors.toList());
		
		Set<Integer> classIds = new HashSet<>();
		for (Integer studentId : studentIds) {
			List<ClassEntity> classes = classRepository.findByStudents_Id(studentId);
			for (ClassEntity c : classes) {
				classIds.add(c.getId());
			}
		}
		
		List<ExamDTO> result = new ArrayList<>();
		for (Integer classId : classIds) {
			List<ExamEntity> exams = examRepository.findByClassEntity_Id(classId);
			for (ExamEntity exam : exams) {
				result.add(examConverter.toDTO(exam));
			}
		}
		
		return result;
	}

	@Override
	public List<ExamResultDTO> getExamResultsByParentUserId(Integer parentUserId) {
		List<StudentParentEntity> studentParents = studentParentRepository.findByParentUserId(parentUserId);
		
		if (studentParents.isEmpty()) {
			return new ArrayList<>();
		}
		
		List<Integer> studentIds = studentParents.stream()
			.map(sp -> sp.getStudentEntity().getId())
			.collect(Collectors.toList());
		
		return examResultRepository.findByStudentIds(studentIds).stream()
			.map(examConverter::toResultDTO)
			.collect(Collectors.toList());
	}

}
