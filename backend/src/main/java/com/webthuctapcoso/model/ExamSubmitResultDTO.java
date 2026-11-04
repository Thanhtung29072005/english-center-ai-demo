package com.webthuctapcoso.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ExamSubmitResultDTO {
	private Integer attemptId;
	private BigDecimal score;
	private Integer correctCount;
	private Integer totalQuestions;
	private String status;
	private LocalDateTime submittedAt;
	public Integer getAttemptId() {
		return attemptId;
	}
	public void setAttemptId(Integer attemptId) {
		this.attemptId = attemptId;
	}
	public BigDecimal getScore() {
		return score;
	}
	public void setScore(BigDecimal score) {
		this.score = score;
	}
	public Integer getCorrectCount() {
		return correctCount;
	}
	public void setCorrectCount(Integer correctCount) {
		this.correctCount = correctCount;
	}
	public Integer getTotalQuestions() {
		return totalQuestions;
	}
	public void setTotalQuestions(Integer totalQuestions) {
		this.totalQuestions = totalQuestions;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public LocalDateTime getSubmittedAt() {
		return submittedAt;
	}
	public void setSubmittedAt(LocalDateTime submittedAt) {
		this.submittedAt = submittedAt;
	}
	
}
