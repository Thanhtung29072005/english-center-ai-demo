package com.webthuctapcoso.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.webthuctapcoso.model.CreateExamQuestionDTO;
import com.webthuctapcoso.model.CreateExamRequestDTO;
import com.webthuctapcoso.model.ExamAttemptDTO;
import com.webthuctapcoso.model.ExamDTO;
import com.webthuctapcoso.model.ExamQuestionDTO;
import com.webthuctapcoso.model.ExamResultDTO;
import com.webthuctapcoso.model.ExamResultRequestDTO;
import com.webthuctapcoso.model.ExamSubmitResultDTO;
import com.webthuctapcoso.model.StartExamResponseDTO;
import com.webthuctapcoso.model.SubmitExamRequestDTO;

public interface ExamService {
	List<ExamDTO> getAllExams();

	ExamDTO createExam(CreateExamRequestDTO request);

	ExamDTO getExamById(Integer id);

	List<ExamDTO> getExamsByClassId(Integer classId);

	ExamDTO updateExam(Integer id, CreateExamRequestDTO request);

	void deleteExam(Integer id);

	List<ExamResultDTO> getExamResultsByExamId(Integer examId);

	List<ExamResultDTO> getExamResultsByStudentId(Integer studentId);

	ExamResultDTO getExamResultById(Integer id);

	ExamResultDTO updateExamResult(Integer id, ExamResultRequestDTO request);

	ExamResultDTO createExamResult(ExamResultRequestDTO request);

	void deleteExamResult(Integer id);

	ExamDTO uploadExamPdf(Integer id, MultipartFile file);

	ExamQuestionDTO addQuestion(Integer examId, CreateExamQuestionDTO request);

	List<ExamQuestionDTO> getQuestionsByExamId(Integer examId);

	void deleteQuestion(Integer questionId);

	ExamDTO publishExam(Integer id);

	List<ExamDTO> getAvailableExamsByClassId(Integer classId);

	StartExamResponseDTO startExam(Integer examId, Integer studentId);

	ExamAttemptDTO getAttempt(Integer attemptId);

	ExamSubmitResultDTO submitAttempt(Integer attemptId, SubmitExamRequestDTO request);
}
