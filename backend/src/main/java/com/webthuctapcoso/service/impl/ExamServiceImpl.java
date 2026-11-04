package com.webthuctapcoso.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.webthuctapcoso.converter.ExamConverter;
import com.webthuctapcoso.exception.ResourceNotFoundException;
import com.webthuctapcoso.model.CreateExamQuestionDTO;
import com.webthuctapcoso.model.CreateExamRequestDTO;
import com.webthuctapcoso.model.ExamAttemptDTO;
import com.webthuctapcoso.model.ExamDTO;
import com.webthuctapcoso.model.ExamQuestionDTO;
import com.webthuctapcoso.model.ExamResultDTO;
import com.webthuctapcoso.model.ExamResultRequestDTO;
import com.webthuctapcoso.model.ExamSubmitResultDTO;
import com.webthuctapcoso.model.StartExamResponseDTO;
import com.webthuctapcoso.model.SubmitAnswerDTO;
import com.webthuctapcoso.model.SubmitExamRequestDTO;
import com.webthuctapcoso.repository.ClassRepository;
import com.webthuctapcoso.repository.ExamAnswerRepository;
import com.webthuctapcoso.repository.ExamAttemptRepository;
import com.webthuctapcoso.repository.ExamQuestionRepository;
import com.webthuctapcoso.repository.ExamRepository;
import com.webthuctapcoso.repository.ExamResultRepository;
import com.webthuctapcoso.repository.StudentRepository;
import com.webthuctapcoso.repository.TeacherRepository;
import com.webthuctapcoso.repository.entity.ClassEntity;
import com.webthuctapcoso.repository.entity.ExamAnswerEntity;
import com.webthuctapcoso.repository.entity.ExamAttemptEntity;
import com.webthuctapcoso.repository.entity.ExamEntity;
import com.webthuctapcoso.repository.entity.ExamQuestionEntity;
import com.webthuctapcoso.repository.entity.ExamResultEntity;
import com.webthuctapcoso.repository.entity.StudentEntity;
import com.webthuctapcoso.repository.entity.TeacherEntity;
import com.webthuctapcoso.service.ExamService;

@org.springframework.stereotype.Service
public class ExamServiceImpl implements ExamService {
	@Autowired private ExamRepository examRepository;
	@Autowired private ExamResultRepository examResultRepository;
	@Autowired private StudentRepository studentRepository;
	@Autowired private ExamQuestionRepository examQuestionRepository;
	@Autowired private ExamAttemptRepository examAttemptRepository;
	@Autowired private ExamAnswerRepository examAnswerRepository;
	@Autowired private ExamConverter examConverter;
	@Autowired private ClassRepository classRepository;
	@Autowired private TeacherRepository teacherRepository;

	@Override
	public List<ExamDTO> getAllExams() {
		return examRepository.findAll().stream().map(examConverter::toDTO).collect(Collectors.toList());
	}
	@Override
	@Transactional
	public ExamDTO createExam(CreateExamRequestDTO request) {
		ExamEntity examEntity = new ExamEntity();
		ClassEntity classEntity = classRepository.findById(request.getClassId()).orElseThrow(() -> new ResourceNotFoundException("Class not found"));
		TeacherEntity teacherEntity = teacherRepository.findById(request.getTeacherId()).orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
		examEntity.setClassEntity(classEntity);
		examEntity.setTeacherEntity(teacherEntity);
		examEntity.setExamDate(request.getExamDate());
		examEntity.setExamType(request.getExamType());
		examEntity.setTitle(request.getTitle());
		examEntity.setDescription(request.getDescription());
		examEntity.setDurationMinutes(request.getDurationMinutes());
		examEntity.setStartTime(request.getStartTime());
		examEntity.setEndTime(request.getEndTime());
		examEntity.setStatus("DRAFT");
		return examConverter.toDTO(examRepository.save(examEntity));
	}
	@Override
	public ExamDTO getExamById(Integer id) {
		return examConverter.toDTO(examRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Exam not found")));
	}
	@Override
	public List<ExamDTO> getExamsByClassId(Integer classId) {
		return examRepository.findByClassEntity_Id(classId).stream().map(examConverter::toDTO).collect(Collectors.toList());
	}
	@Override
	@Transactional
	public ExamDTO updateExam(Integer id, CreateExamRequestDTO request) {
		ExamEntity examEntity = examRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
		examEntity.setExamDate(request.getExamDate());
		examEntity.setExamType(request.getExamType());
		examEntity.setTitle(request.getTitle());
		examEntity.setDescription(request.getDescription());
		examEntity.setDurationMinutes(request.getDurationMinutes());
		examEntity.setStartTime(request.getStartTime());
		examEntity.setEndTime(request.getEndTime());
		if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) examEntity.setStatus(request.getStatus());
		examEntity.setClassEntity(classRepository.findById(request.getClassId()).orElseThrow(() -> new ResourceNotFoundException("Class not found")));
		examEntity.setTeacherEntity(teacherRepository.findById(request.getTeacherId()).orElseThrow(() -> new ResourceNotFoundException("Teacher not found")));
		return examConverter.toDTO(examRepository.save(examEntity));
	}
	@Override
	@Transactional
	public void deleteExam(Integer id) {
		ExamEntity examEntity = examRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
		examRepository.delete(examEntity);
	}
	@Override
	public List<ExamResultDTO> getExamResultsByExamId(Integer examId) {
		return examResultRepository.findByExamEntity_Id(examId).stream().map(examConverter::toResultDTO).collect(Collectors.toList());
	}
	@Override
	public List<ExamResultDTO> getExamResultsByStudentId(Integer studentId) {
		return examResultRepository.findByStudentEntity_Id(studentId).stream().map(examConverter::toResultDTO).collect(Collectors.toList());
	}
	@Override
	public ExamResultDTO getExamResultById(Integer id) {
		return examConverter.toResultDTO(examResultRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Exam result not found")));
	}
	@Override
	@Transactional
	public ExamResultDTO createExamResult(ExamResultRequestDTO request) {
		ExamResultEntity entity = new ExamResultEntity();
		entity.setComment(request.getComment());
		entity.setListeningScore(request.getListeningScore());
		entity.setReadingWritingScore(request.getReadingWritingScore());
		entity.setSpeakingScore(request.getSpeakingScore());
		entity.setStudentEntity(studentRepository.findById(request.getStudentId()).orElseThrow(() -> new ResourceNotFoundException("Student not found")));
		entity.setExamEntity(examRepository.findById(request.getExamId()).orElseThrow(() -> new ResourceNotFoundException("Exam not found")));
		return examConverter.toResultDTO(examResultRepository.save(entity));
	}
	@Override
	public void deleteExamResult(Integer id) {
		if (!examResultRepository.existsById(id)) throw new ResourceNotFoundException("Exam result not found with id: " + id);
		examResultRepository.deleteById(id);
	}
	@Override
	@Transactional
	public ExamResultDTO updateExamResult(Integer id, ExamResultRequestDTO request) {
		ExamResultEntity entity = examResultRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Exam result not found"));
		entity.setComment(request.getComment());
		entity.setListeningScore(request.getListeningScore());
		entity.setReadingWritingScore(request.getReadingWritingScore());
		entity.setSpeakingScore(request.getSpeakingScore());
		entity.setStudentEntity(studentRepository.findById(request.getStudentId()).orElseThrow(() -> new ResourceNotFoundException("Student not found")));
		entity.setExamEntity(examRepository.findById(request.getExamId()).orElseThrow(() -> new ResourceNotFoundException("Exam not found")));
		return examConverter.toResultDTO(examResultRepository.save(entity));
	}
	@Override
	@Transactional
	public ExamDTO uploadExamPdf(Integer id, MultipartFile file) {
		ExamEntity exam = examRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
		if (file == null || file.isEmpty()) throw new RuntimeException("PDF file is required");
		String original = StringUtils.cleanPath(file.getOriginalFilename() == null ? "exam.pdf" : file.getOriginalFilename());
		String contentType = file.getContentType();
		if (!original.toLowerCase().endsWith(".pdf") || (contentType != null && !"application/pdf".equalsIgnoreCase(contentType))) throw new RuntimeException("Only PDF files are allowed");
		try {
			Path uploadDir = Paths.get("uploads", "exam-pdfs").toAbsolutePath().normalize();
			Files.createDirectories(uploadDir);
			String stored = "exam-" + id + "-" + UUID.randomUUID() + ".pdf";
			Files.copy(file.getInputStream(), uploadDir.resolve(stored), StandardCopyOption.REPLACE_EXISTING);
			exam.setPdfFileName(original);
			exam.setPdfFileUrl("/uploads/exam-pdfs/" + stored);
			exam.setPdfUploadedAt(LocalDateTime.now());
			return examConverter.toDTO(examRepository.save(exam));
		} catch (IOException e) {
			throw new RuntimeException("Could not store PDF file", e);
		}
	}
	@Override
	@Transactional
	public ExamQuestionDTO addQuestion(Integer examId, CreateExamQuestionDTO request) {
		ExamEntity exam = examRepository.findById(examId).orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
		ExamQuestionEntity entity = examQuestionRepository.findByExamEntity_IdAndQuestionNumber(examId, request.getQuestionNumber()).orElse(new ExamQuestionEntity());
		entity.setExamEntity(exam);
		entity.setQuestionNumber(request.getQuestionNumber());
		entity.setCorrectAnswer(normalizeAnswer(request.getCorrectAnswer()));
		return examConverter.toQuestionDTO(examQuestionRepository.save(entity));
	}
	@Override
	public List<ExamQuestionDTO> getQuestionsByExamId(Integer examId) {
		return examQuestionRepository.findByExamEntity_IdOrderByQuestionNumberAsc(examId).stream().map(examConverter::toQuestionDTO).collect(Collectors.toList());
	}
	@Override
	@Transactional
	public void deleteQuestion(Integer questionId) {
		examQuestionRepository.deleteById(questionId);
	}
	@Override
	@Transactional
	public ExamDTO publishExam(Integer id) {
		ExamEntity exam = examRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
		exam.setStatus("PUBLISHED");
		return examConverter.toDTO(examRepository.save(exam));
	}
	@Override
	public List<ExamDTO> getAvailableExamsByClassId(Integer classId) {
		return examRepository.findByClassEntity_IdOrderByExamDateDesc(classId).stream()
				.filter(exam -> !"DRAFT".equalsIgnoreCase(exam.getStatus()))
				.map(examConverter::toDTO)
				.collect(Collectors.toList());
	}
	@Override
	@Transactional
	public StartExamResponseDTO startExam(Integer examId, Integer studentId) {
		ExamEntity exam = examRepository.findById(examId).orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
		StudentEntity student = studentRepository.findById(studentId).orElseThrow(() -> new ResourceNotFoundException("Student not found"));
		if (!"PUBLISHED".equalsIgnoreCase(exam.getStatus())) throw new RuntimeException("Exam is not published");
		LocalDateTime now = LocalDateTime.now();
		if (exam.getStartTime() != null && now.isBefore(exam.getStartTime())) throw new RuntimeException("Exam is not open yet");
		if (isExamClosed(exam, now)) throw new RuntimeException("Exam is closed");
		ExamAttemptEntity attempt = examAttemptRepository.findByExamEntity_IdAndStudentEntity_Id(examId, studentId).orElse(null);
		if (attempt != null && !"IN_PROGRESS".equalsIgnoreCase(attempt.getStatus())) throw new RuntimeException("Attempt already submitted");
		if (attempt != null && isExpired(attempt, exam, now)) throw new RuntimeException("Attempt expired");
		if (attempt == null) {
			attempt = new ExamAttemptEntity();
			attempt.setExamEntity(exam);
			attempt.setStudentEntity(student);
			attempt.setStartedAt(now);
			attempt.setStatus("IN_PROGRESS");
			attempt = examAttemptRepository.save(attempt);
		}
		StartExamResponseDTO dto = new StartExamResponseDTO();
		dto.setAttemptId(attempt.getId());
		dto.setExamId(exam.getId());
		dto.setTitle(exam.getTitle());
		dto.setPdfFileUrl(exam.getPdfFileUrl());
		dto.setDurationMinutes(exam.getDurationMinutes());
		dto.setStartedAt(attempt.getStartedAt());
		dto.setDeadline(exam.getDurationMinutes() == null ? null : attempt.getStartedAt().plusMinutes(exam.getDurationMinutes()));
		dto.setQuestions(examQuestionRepository.findByExamEntity_IdOrderByQuestionNumberAsc(examId).stream().map(examConverter::toStudentQuestionDTO).collect(Collectors.toList()));
		return dto;
	}
	@Override
	public ExamAttemptDTO getAttempt(Integer attemptId) {
		ExamAttemptEntity attempt = examAttemptRepository.findById(attemptId).orElseThrow(() -> new ResourceNotFoundException("Attempt not found"));
		ExamAttemptDTO dto = examConverter.toAttemptDTO(attempt);
		dto.setAnswers(examAnswerRepository.findByAttemptEntity_Id(attemptId).stream().map(examConverter::toAnswerDTO).collect(Collectors.toList()));
		return dto;
	}
	@Override
	@Transactional
	public ExamSubmitResultDTO submitAttempt(Integer attemptId, SubmitExamRequestDTO request) {
		ExamAttemptEntity attempt = examAttemptRepository.findById(attemptId).orElseThrow(() -> new ResourceNotFoundException("Attempt not found"));
		if (!"IN_PROGRESS".equalsIgnoreCase(attempt.getStatus())) throw new RuntimeException("Attempt already submitted");
		ExamEntity exam = attempt.getExamEntity();
		List<ExamQuestionEntity> questions = examQuestionRepository.findByExamEntity_IdOrderByQuestionNumberAsc(exam.getId());
		Map<Integer, String> selected = new HashMap<>();
		if (request.getAnswers() != null) {
			for (SubmitAnswerDTO answer : request.getAnswers()) selected.put(answer.getQuestionNumber(), normalizeAnswer(answer.getSelectedAnswer()));
		}
		examAnswerRepository.deleteByAttemptEntity_Id(attemptId);
		int correctCount = 0;
		for (ExamQuestionEntity question : questions) {
			String selectedAnswer = selected.get(question.getQuestionNumber());
			boolean correct = selectedAnswer != null && selectedAnswer.equalsIgnoreCase(question.getCorrectAnswer());
			if (correct) correctCount++;
			ExamAnswerEntity answerEntity = new ExamAnswerEntity();
			answerEntity.setAttemptEntity(attempt);
			answerEntity.setQuestionEntity(question);
			answerEntity.setSelectedAnswer(selectedAnswer);
			answerEntity.setIsCorrect(correct);
			examAnswerRepository.save(answerEntity);
		}
		BigDecimal score = questions.isEmpty() ? BigDecimal.ZERO : BigDecimal.valueOf(correctCount).multiply(BigDecimal.TEN).divide(BigDecimal.valueOf(questions.size()), 2, RoundingMode.HALF_UP);
		LocalDateTime now = LocalDateTime.now();
		String status = isExpired(attempt, exam, now) ? "EXPIRED" : "SUBMITTED";
		attempt.setScore(score);
		attempt.setSubmittedAt(now);
		attempt.setStatus(status);
		examAttemptRepository.save(attempt);
		ExamResultEntity result = examResultRepository.findByExamEntity_IdAndStudentEntity_Id(exam.getId(), attempt.getStudentEntity().getId()).orElse(new ExamResultEntity());
		result.setExamEntity(exam);
		result.setStudentEntity(attempt.getStudentEntity());
		result.setReadingWritingScore(score.toPlainString());
		examResultRepository.save(result);
		ExamSubmitResultDTO dto = new ExamSubmitResultDTO();
		dto.setAttemptId(attempt.getId());
		dto.setScore(score);
		dto.setCorrectCount(correctCount);
		dto.setTotalQuestions(questions.size());
		dto.setStatus(status);
		dto.setSubmittedAt(now);
		return dto;
	}
	private String normalizeAnswer(String answer) {
		if (answer == null) return null;
		String value = answer.trim().toUpperCase();
		if (!value.matches("[ABCD]")) throw new RuntimeException("Answer must be A, B, C or D");
		return value;
	}
	private boolean isExpired(ExamAttemptEntity attempt, ExamEntity exam, LocalDateTime now) {
		return exam.getDurationMinutes() != null && now.isAfter(attempt.getStartedAt().plusMinutes(exam.getDurationMinutes()));
	}
	private boolean isExamClosed(ExamEntity exam, LocalDateTime now) {
		if (exam.getEndTime() != null) return now.isAfter(exam.getEndTime());
		return exam.getStartTime() != null && exam.getDurationMinutes() != null && now.isAfter(exam.getStartTime().plusMinutes(exam.getDurationMinutes()));
	}
}
