package com.webthuctapcoso.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;

import com.webthuctapcoso.model.CreateExamQuestionDTO;
import com.webthuctapcoso.model.CreateExamRequestDTO;
import com.webthuctapcoso.model.ExamAttemptDTO;
import com.webthuctapcoso.model.ExamDTO;
import com.webthuctapcoso.model.ExamQuestionDTO;
import com.webthuctapcoso.model.ExamResultDTO;
import com.webthuctapcoso.model.ExamSubmitResultDTO;
import com.webthuctapcoso.model.StartExamResponseDTO;
import com.webthuctapcoso.model.SubmitExamRequestDTO;

@RestController
@RequestMapping("/api/exams")
public class ExamAPI {
	@Autowired
	private com.webthuctapcoso.service.ExamService examService;
	@GetMapping
	public List<ExamDTO> getAllExams() {
	    return examService.getAllExams();
	}
	@PostMapping
	public ExamDTO createExam(@RequestBody CreateExamRequestDTO request) {
	    return examService.createExam(request);
	}
	@GetMapping("/{id}")
	public ExamDTO getExamById(@PathVariable Integer id) {
		return examService.getExamById(id);
	}
	@GetMapping("/class/{classId}")
	public List<ExamDTO> getExamsByClassId(@PathVariable Integer classId){
		return examService.getExamsByClassId(classId);
	}
	@GetMapping("/class/{classId}/available")
	public List<ExamDTO> getAvailableExamsByClassId(@PathVariable Integer classId){
		return examService.getAvailableExamsByClassId(classId);
	}
	@PutMapping("/{id}")
	public ExamDTO updateExam(@PathVariable Integer id, @RequestBody CreateExamRequestDTO request) {
		return examService.updateExam(id, request);
	}
	@DeleteMapping("/{id}")
	public void deleteExam(@PathVariable Integer id) {
		examService.deleteExam(id);
	}
	@PostMapping("/{id}/pdf")
	public ExamDTO uploadExamPdf(@PathVariable Integer id, @RequestParam("file") MultipartFile file) {
		return examService.uploadExamPdf(id, file);
	}
	@PostMapping("/{id}/questions")
	public ExamQuestionDTO addQuestion(@PathVariable Integer id, @RequestBody CreateExamQuestionDTO request) {
		return examService.addQuestion(id, request);
	}
	@GetMapping("/{id}/questions")
	public List<ExamQuestionDTO> getQuestions(@PathVariable Integer id) {
		return examService.getQuestionsByExamId(id);
	}
	@DeleteMapping("/questions/{questionId}")
	public void deleteQuestion(@PathVariable Integer questionId) {
		examService.deleteQuestion(questionId);
	}
	@PutMapping("/{id}/publish")
	public ExamDTO publishExam(@PathVariable Integer id) {
		return examService.publishExam(id);
	}
	@PostMapping("/{id}/start")
	public StartExamResponseDTO startExam(@PathVariable Integer id, @RequestParam Integer studentId) {
		return examService.startExam(id, studentId);
	}
	@GetMapping("/attempts/{attemptId}")
	public ExamAttemptDTO getAttempt(@PathVariable Integer attemptId) {
		return examService.getAttempt(attemptId);
	}
	@PostMapping("/attempts/{attemptId}/submit")
	public ExamSubmitResultDTO submitAttempt(@PathVariable Integer attemptId, @RequestBody SubmitExamRequestDTO request) {
		return examService.submitAttempt(attemptId, request);
	}
	@GetMapping("/{examId}/results")
	public List<ExamResultDTO> getExamResultsByExamId(@PathVariable Integer examId) {
		return examService.getExamResultsByExamId(examId);
	}
	@GetMapping("/results/student/{studentId}")
	public List<ExamResultDTO> getExamResultsByStudentId(@PathVariable Integer studentId) {
		return examService.getExamResultsByStudentId(studentId);
	}
	@PostMapping("/results")
	public ExamResultDTO createExamResult(@RequestBody com.webthuctapcoso.model.ExamResultRequestDTO request) {
		return examService.createExamResult(request);
	}
	@GetMapping("/results/{id}")
	public ExamResultDTO getExamResultById(@PathVariable Integer id) {
		return examService.getExamResultById(id);
	}
	@PutMapping("/results/{id}")
	public ExamResultDTO updateExamResult(@PathVariable Integer id, @RequestBody com.webthuctapcoso.model.ExamResultRequestDTO request) {
		return examService.updateExamResult(id, request);
	}
	@DeleteMapping("/results/{id}")
	public void deleteExamResult(@PathVariable Integer id) {
		examService.deleteExamResult(id);
	}

}
