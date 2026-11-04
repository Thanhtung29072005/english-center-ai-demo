package com.webthuctapcoso.model;

import java.time.LocalDateTime;

public class DailyCommentDTO {
	private Integer id;
	private Integer lessonId;
	private String lessonDate;
	private String className;
	private Integer studentId;
	private String studentName;
	private String vocabularyScore;
	private String schoolExamScore;
	private String homeworkStatus;
	private String comment;
	private LocalDateTime createdAt;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getLessonId() {
		return lessonId;
	}
	public void setLessonId(Integer lessonId) {
		this.lessonId = lessonId;
	}
	public String getLessonDate() {
		return lessonDate;
	}
	public void setLessonDate(String lessonDate) {
		this.lessonDate = lessonDate;
	}
	public String getClassName() {
		return className;
	}
	public void setClassName(String className) {
		this.className = className;
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
