package com.webthuctapcoso.model;

import java.time.LocalDateTime;
import java.util.List;

public class StartExamResponseDTO {
	private Integer attemptId;
	private Integer examId;
	private String title;
	private String pdfFileUrl;
	private Integer durationMinutes;
	private LocalDateTime startedAt;
	private LocalDateTime deadline;
	private List<ExamQuestionStudentDTO> questions;
	public Integer getAttemptId() {
		return attemptId;
	}
	public void setAttemptId(Integer attemptId) {
		this.attemptId = attemptId;
	}
	public Integer getExamId() {
		return examId;
	}
	public void setExamId(Integer examId) {
		this.examId = examId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getPdfFileUrl() {
		return pdfFileUrl;
	}
	public void setPdfFileUrl(String pdfFileUrl) {
		this.pdfFileUrl = pdfFileUrl;
	}
	public Integer getDurationMinutes() {
		return durationMinutes;
	}
	public void setDurationMinutes(Integer durationMinutes) {
		this.durationMinutes = durationMinutes;
	}
	public LocalDateTime getStartedAt() {
		return startedAt;
	}
	public void setStartedAt(LocalDateTime startedAt) {
		this.startedAt = startedAt;
	}
	public LocalDateTime getDeadline() {
		return deadline;
	}
	public void setDeadline(LocalDateTime deadline) {
		this.deadline = deadline;
	}
	public List<ExamQuestionStudentDTO> getQuestions() {
		return questions;
	}
	public void setQuestions(List<ExamQuestionStudentDTO> questions) {
		this.questions = questions;
	}
	
}
