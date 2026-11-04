package com.webthuctapcoso.service.impl;

import com.webthuctapcoso.converter.ClassDTOConverter;
import com.webthuctapcoso.converter.DailyCommentDTOConverter;
import com.webthuctapcoso.converter.ExamConverter;
import com.webthuctapcoso.converter.LessonDTOConverter;
import com.webthuctapcoso.model.ClassDTO;
import com.webthuctapcoso.model.DailyCommentDTO;
import com.webthuctapcoso.model.ExamDTO;
import com.webthuctapcoso.model.ExamResultDTO;
import com.webthuctapcoso.model.LessonDTO;
import com.webthuctapcoso.repository.ClassRepository;
import com.webthuctapcoso.repository.DailyCommentRepository;
import com.webthuctapcoso.repository.ExamRepository;
import com.webthuctapcoso.repository.ExamResultRepository;
import com.webthuctapcoso.repository.LessonRepository;
import com.webthuctapcoso.repository.StudentRepository;
import com.webthuctapcoso.repository.UserRepository;
import com.webthuctapcoso.repository.eNum.UserRole;
import com.webthuctapcoso.repository.entity.ClassEntity;
import com.webthuctapcoso.repository.entity.DailyCommentEntity;
import com.webthuctapcoso.repository.entity.ExamEntity;
import com.webthuctapcoso.repository.entity.LessonEntity;
import com.webthuctapcoso.repository.entity.StudentEntity;
import com.webthuctapcoso.repository.entity.UserEntity;
import com.webthuctapcoso.service.StudentPortalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
@Service
@Transactional
public class StudentPortalServiceImpl implements StudentPortalService {
	@Autowired
	private UserRepository userRepository;
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
	private StudentRepository studentRepository;
	@Autowired
	private ClassDTOConverter classDTOConverter;
	@Autowired
	private LessonDTOConverter lessonDTOConverter;
	@Autowired
	private DailyCommentDTOConverter dailyCommentDTOConverter;
	@Autowired
	private ExamConverter examConverter;

	@Override
	public Integer getStudentIdByUserId(Integer userId) {
		List<Integer> studentIds = getStudentIds(userId);
		return studentIds.isEmpty() ? null : studentIds.get(0);
	}

	@Override
	public List<ClassDTO> getClassesByStudentUserId(Integer userId) {
		List<Integer> studentIds = getStudentIds(userId);
		if (studentIds.isEmpty()) return new ArrayList<>();

		List<ClassDTO> result = new ArrayList<>();
		for (Integer studentId : studentIds) {
			List<ClassEntity> classes = classRepository.findByStudents_Id(studentId);
			for (ClassEntity c : classes) {
				result.add(classDTOConverter.toClassDTO(c));
			}
		}
		return result;
	}

	@Override
	public List<LessonDTO> getLessonsByStudentUserId(Integer userId) {
		List<Integer> studentIds = getStudentIds(userId);
		if (studentIds.isEmpty()) return new ArrayList<>();

		List<ClassDTO> classes = getClassesByStudentUserId(userId);
		List<LessonDTO> result = new ArrayList<>();
		for (ClassDTO c : classes) {
			List<LessonEntity> lessons = lessonRepository.findByClassEntityId(c.getId());
			for (LessonEntity lesson : lessons) {
				result.add(lessonDTOConverter.toLessonDTO(lesson));
			}
		}
		return result;
	}

	@Override
	public List<DailyCommentDTO> getReviewsByStudentUserId(Integer userId) {
		List<Integer> studentIds = getStudentIds(userId);
		if (studentIds.isEmpty()) return new ArrayList<>();

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
	public List<ExamDTO> getExamsByStudentUserId(Integer userId) {
		List<Integer> studentIds = getStudentIds(userId);
		if (studentIds.isEmpty()) return new ArrayList<>();

		List<ClassDTO> classes = getClassesByStudentUserId(userId);
		List<ExamDTO> result = new ArrayList<>();
		for (ClassDTO c : classes) {
			List<ExamEntity> exams = examRepository.findByClassEntity_Id(c.getId());
			for (ExamEntity exam : exams) {
				result.add(examConverter.toDTO(exam));
			}
		}
		return result;
	}

	@Override
	public List<ExamResultDTO> getExamResultsByStudentUserId(Integer userId) {
		List<Integer> studentIds = getStudentIds(userId);
		if (studentIds.isEmpty()) return new ArrayList<>();

		List<ExamResultDTO> result = new ArrayList<>();
		for (Integer studentId : studentIds) {
			examResultRepository.findByStudentEntity_Id(studentId).stream()
				.map(examConverter::toResultDTO)
				.forEach(result::add);
		}
		return result;
	}

	private List<Integer> getStudentIds(Integer userId) {
		UserEntity user = userRepository.findById(userId)
			.orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản học sinh"));
		if (user.getRole() != UserRole.STUDENT) {
			throw new RuntimeException("Tài khoản không phải học sinh");
		}
		StudentEntity student = user.getStudent();
		if (student == null && user.getFullName() != null) {
			student = studentRepository.findFirstByNameIgnoreCase(user.getFullName().trim()).orElse(null);
		}
		if (student == null && user.getUsername() != null) {
			student = studentRepository.findFirstByNameIgnoreCase(user.getUsername().trim()).orElse(null);
		}
		if (student == null) {
			return Collections.emptyList();
		}
		return Collections.singletonList(student.getId());
	}
}
