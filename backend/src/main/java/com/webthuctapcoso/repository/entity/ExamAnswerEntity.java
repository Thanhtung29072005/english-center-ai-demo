package com.webthuctapcoso.repository.entity;

import java.time.LocalDateTime;

import javax.persistence.*;

@Entity
@Table(name = "exam_answers")
public class ExamAnswerEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "attempt_id", nullable = false)
	private ExamAttemptEntity attemptEntity;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "question_id", nullable = false)
	private ExamQuestionEntity questionEntity;
	@Column(name = "selected_answer")
	private String selectedAnswer;
	@Column(name = "is_correct", nullable = false)
	private Boolean isCorrect;
	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;
	@PrePersist
	public void prePersist() {
		createdAt = LocalDateTime.now();
		if (isCorrect == null) {
			isCorrect = false;
		}
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public ExamAttemptEntity getAttemptEntity() {
		return attemptEntity;
	}
	public void setAttemptEntity(ExamAttemptEntity attemptEntity) {
		this.attemptEntity = attemptEntity;
	}
	public ExamQuestionEntity getQuestionEntity() {
		return questionEntity;
	}
	public void setQuestionEntity(ExamQuestionEntity questionEntity) {
		this.questionEntity = questionEntity;
	}
	public String getSelectedAnswer() {
		return selectedAnswer;
	}
	public void setSelectedAnswer(String selectedAnswer) {
		this.selectedAnswer = selectedAnswer;
	}
	public Boolean getIsCorrect() {
		return isCorrect;
	}
	public void setIsCorrect(Boolean isCorrect) {
		this.isCorrect = isCorrect;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	
}
