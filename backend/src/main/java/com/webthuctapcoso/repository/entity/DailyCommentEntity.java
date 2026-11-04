package com.webthuctapcoso.repository.entity;

import java.time.LocalDateTime;

import javax.persistence.*;

@Entity
@Table(name = "daily_comments")
public class DailyCommentEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="lesson_id",nullable = false)
	private LessonEntity lessonEntity;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="student_id",nullable = false)
	private StudentEntity studentEntity;
	@Column(name="vocabulary_score")
	private String vocabularyScore;
	@Column(name = "school_exam_score")
    private String schoolExamScore;

    @Column(name = "homework_status")
    private String homeworkStatus;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    @PrePersist
    protected void onCreate() {
		createdAt = LocalDateTime.now();
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public LessonEntity getLessonEntity() {
		return lessonEntity;
	}
	public void setLessonEntity(LessonEntity lessonEntity) {
		this.lessonEntity = lessonEntity;
	}
	public StudentEntity getStudentEntity() {
		return studentEntity;
	}
	public void setStudentEntity(StudentEntity studentEntity) {
		this.studentEntity = studentEntity;
	}
	public String getVocabularyScore() {
		return vocabularyScore;
	}
	public void setVocabularyScore(String vocabularyScore) {
		this.vocabularyScore = vocabularyScore;
	}
	public String getSchoolExamScore() {
		return schoolExamScore;
	}
	public void setSchoolExamScore(String schoolExamScore) {
		this.schoolExamScore = schoolExamScore;
	}
	public String getHomeworkStatus() {
		return homeworkStatus;
	}
	public void setHomeworkStatus(String homeworkStatus) {
		this.homeworkStatus = homeworkStatus;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
    
}
