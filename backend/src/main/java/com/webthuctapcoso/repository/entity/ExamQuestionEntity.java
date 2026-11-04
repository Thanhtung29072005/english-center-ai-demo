package com.webthuctapcoso.repository.entity;

import java.time.LocalDateTime;

import javax.persistence.*;

@Entity
@Table(name = "exam_questions")
public class ExamQuestionEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "exam_id", nullable = false)
	private ExamEntity examEntity;
	@Column(name = "question_number", nullable = false)
	private Integer questionNumber;
	@Column(name = "correct_answer", nullable = false)
	private String correctAnswer;
	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;
	@PrePersist
	public void prePersist() {
		createdAt = LocalDateTime.now();
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public ExamEntity getExamEntity() {
		return examEntity;
	}
	public void setExamEntity(ExamEntity examEntity) {
		this.examEntity = examEntity;
	}
	public Integer getQuestionNumber() {
		return questionNumber;
	}
	public void setQuestionNumber(Integer questionNumber) {
		this.questionNumber = questionNumber;
	}
	public String getCorrectAnswer() {
		return correctAnswer;
	}
	public void setCorrectAnswer(String correctAnswer) {
		this.correctAnswer = correctAnswer;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	
}
