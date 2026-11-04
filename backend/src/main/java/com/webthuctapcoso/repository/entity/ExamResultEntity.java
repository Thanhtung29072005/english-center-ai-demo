package com.webthuctapcoso.repository.entity;

import javax.persistence.*;

@Entity
@Table(name = "exam_results")
public class ExamResultEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "exam_id", nullable = false)
	private ExamEntity examEntity;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "student_id", nullable = false)
	private StudentEntity studentEntity;
	@Column(name = "speaking_score")
	private String speakingScore;
	@Column(name = "listening_score")
	private String listeningScore;
	@Column(name ="reading_writing_score")
	private String readingWritingScore;
	@Column(name ="comment",columnDefinition = "TEXT")
	private String comment;
	@Column(name ="created_at")
	private java.time.LocalDateTime createdAt;
	@PrePersist
	public void prePersist() {
	    createdAt = java.time.LocalDateTime.now();
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
	public String getSpeakingScore() {
		return speakingScore;
	}
	public void setSpeakingScore(String speakingScore) {
		this.speakingScore = speakingScore;
	}
	public String getListeningScore() {
		return listeningScore;
	}
	public void setListeningScore(String listeningScore) {
		this.listeningScore = listeningScore;
	}
	public String getReadingWritingScore() {
		return readingWritingScore;
	}
	public void setReadingWritingScore(String readingWritingScore) {
		this.readingWritingScore = readingWritingScore;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public java.time.LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(java.time.LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	
}
