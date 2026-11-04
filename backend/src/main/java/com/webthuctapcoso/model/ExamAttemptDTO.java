package com.webthuctapcoso.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ExamAttemptDTO {
	private Integer id;
	private Integer examId;
	private Integer studentId;
	private String studentName;
	private LocalDateTime startedAt;
	private LocalDateTime submittedAt;
	private BigDecimal score;
	private String status;
	private List<ExamAnswerDTO> answers;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getExamId() {
		return examId;
	}
	public void setExamId(Integer examId) {
		this.examId = examId;
	}
	public Integer getStudentId() {
		return studentId;
	}
	public void setStudentId(Integer studentId) {
		this.studentId = studentId;
	}
	public String getStudentName() {
		return studentName;
	}
	public void setStudentName(String studentName) {
		this.studentName = studentName;
	}
	public LocalDateTime getStartedAt() {
		return startedAt;
	}
	public void setStartedAt(LocalDateTime startedAt) {
		this.startedAt = startedAt;
	}
	public LocalDateTime getSubmittedAt() {
		return submittedAt;
	}
	public void setSubmittedAt(LocalDateTime submittedAt) {
		this.submittedAt = submittedAt;
	}
	public BigDecimal getScore() {
		return score;
	}
	public void setScore(BigDecimal score) {
		this.score = score;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public List<ExamAnswerDTO> getAnswers() {
		return answers;
	}
	public void setAnswers(List<ExamAnswerDTO> answers) {
		this.answers = answers;
	}
	
}
