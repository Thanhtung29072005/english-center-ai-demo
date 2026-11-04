package com.webthuctapcoso.repository.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

@Entity
@Table(name = "exam_attempts")
public class ExamAttemptEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "exam_id", nullable = false)
	private ExamEntity examEntity;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "student_id", nullable = false)
	private StudentEntity studentEntity;
	@Column(name = "started_at", nullable = false)
	private LocalDateTime startedAt;
	@Column(name = "submitted_at")
	private LocalDateTime submittedAt;
	@Column(name = "score", nullable = false)
	private BigDecimal score;
	@Column(name = "status", nullable = false)
	private String status;
	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;
	@OneToMany(mappedBy = "attemptEntity", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ExamAnswerEntity> examAnswers = new ArrayList<>();
	@PrePersist
	public void prePersist() {
		createdAt = LocalDateTime.now();
		if (startedAt == null) {
			startedAt = LocalDateTime.now();
		}
		if (score == null) {
			score = BigDecimal.ZERO;
		}
		if (status == null) {
			status = "IN_PROGRESS";
		}
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
	public StudentEntity getStudentEntity() {
		return studentEntity;
	}
	public void setStudentEntity(StudentEntity studentEntity) {
		this.studentEntity = studentEntity;
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
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public List<ExamAnswerEntity> getExamAnswers() {
		return examAnswers;
	}
	public void setExamAnswers(List<ExamAnswerEntity> examAnswers) {
		this.examAnswers = examAnswers;
	}
	
}
