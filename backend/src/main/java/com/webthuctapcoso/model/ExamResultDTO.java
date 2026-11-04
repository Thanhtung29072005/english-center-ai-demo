package com.webthuctapcoso.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ExamResultDTO {
	private Integer id;
	private Integer examId;
	private Integer studentId;
	private String studentName;
	private String examTitle;
	private String examType;
	private String className;
	private LocalDate examDate;
	private String speakingScore;
	private String listeningScore;
	private String readingWritingScore;
	private String comment;
	private LocalDateTime createdAt;
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
	public String getExamTitle() {
		return examTitle;
	}
	public void setExamTitle(String examTitle) {
		this.examTitle = examTitle;
	}
	public String getExamType() {
		return examType;
	}
	public void setExamType(String examType) {
		this.examType = examType;
	}
	public String getClassName() {
		return className;
	}
	public void setClassName(String className) {
		this.className = className;
	}
	public LocalDate getExamDate() {
		return examDate;
	}
	public void setExamDate(LocalDate examDate) {
		this.examDate = examDate;
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
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	
}
