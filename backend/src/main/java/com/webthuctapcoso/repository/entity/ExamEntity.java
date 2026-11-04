package com.webthuctapcoso.repository.entity;

import javax.persistence.*;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
@Entity
@Table(name ="exams")
public class ExamEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@ManyToOne(fetch =FetchType.LAZY)
	@JoinColumn(name ="class_id",nullable = false)
	private ClassEntity classEntity;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "teacher_id",nullable = false)
	private TeacherEntity teacherEntity;
	
	@Column(name = "exam_date",nullable = false)
	private LocalDate examDate;
	@Column(name = "exam_type",nullable = false)
	private String examType;
	@Column(name = "title")
	private String title;
	@Column(name = "description", columnDefinition = "TEXT")
	private String description;
	@Column(name = "duration_minutes")
	private Integer durationMinutes;
	@Column(name = "start_time")
	private LocalDateTime startTime;
	@Column(name = "end_time")
	private LocalDateTime endTime;
	@Column(name = "pdf_file_name")
	private String pdfFileName;
	@Column(name = "pdf_file_url")
	private String pdfFileUrl;
	@Column(name = "pdf_uploaded_at")
	private LocalDateTime pdfUploadedAt;
	@Column(name = "status", nullable = false)
	private String status;
	@Column(name ="created_at",nullable = false)
	private LocalDateTime createdAt;
	@PrePersist
	public void prePersist() {
	    createdAt = LocalDateTime.now();
	    if (status == null) {
	    	status = "DRAFT";
	    }
	}
	@OneToMany(mappedBy = "examEntity", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ExamResultEntity> examResults = new ArrayList<>();
	@OneToMany(mappedBy = "examEntity", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ExamQuestionEntity> examQuestions = new ArrayList<>();
	@OneToMany(mappedBy = "examEntity", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ExamAttemptEntity> examAttempts = new ArrayList<>();
	
	public List<ExamResultEntity> getExamResults() {
		return examResults;
	}
	public void setExamResults(List<ExamResultEntity> examResults) {
		this.examResults = examResults;
	}
	public List<ExamQuestionEntity> getExamQuestions() {
		return examQuestions;
	}
	public void setExamQuestions(List<ExamQuestionEntity> examQuestions) {
		this.examQuestions = examQuestions;
	}
	public List<ExamAttemptEntity> getExamAttempts() {
		return examAttempts;
	}
	public void setExamAttempts(List<ExamAttemptEntity> examAttempts) {
		this.examAttempts = examAttempts;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public ClassEntity getClassEntity() {
		return classEntity;
	}
	public void setClassEntity(ClassEntity classEntity) {
		this.classEntity = classEntity;
	}
	public TeacherEntity getTeacherEntity() {
		return teacherEntity;
	}
	public void setTeacherEntity(TeacherEntity teacherEntity) {
		this.teacherEntity = teacherEntity;
	}
	public LocalDate getExamDate() {
		return examDate;
	}
	public void setExamDate(LocalDate examDate) {
		this.examDate = examDate;
	}
	public String getExamType() {
		return examType;
	}
	public void setExamType(String examType) {
		this.examType = examType;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Integer getDurationMinutes() {
		return durationMinutes;
	}
	public void setDurationMinutes(Integer durationMinutes) {
		this.durationMinutes = durationMinutes;
	}
	public LocalDateTime getStartTime() {
		return startTime;
	}
	public void setStartTime(LocalDateTime startTime) {
		this.startTime = startTime;
	}
	public LocalDateTime getEndTime() {
		return endTime;
	}
	public void setEndTime(LocalDateTime endTime) {
		this.endTime = endTime;
	}
	public String getPdfFileName() {
		return pdfFileName;
	}
	public void setPdfFileName(String pdfFileName) {
		this.pdfFileName = pdfFileName;
	}
	public String getPdfFileUrl() {
		return pdfFileUrl;
	}
	public void setPdfFileUrl(String pdfFileUrl) {
		this.pdfFileUrl = pdfFileUrl;
	}
	public LocalDateTime getPdfUploadedAt() {
		return pdfUploadedAt;
	}
	public void setPdfUploadedAt(LocalDateTime pdfUploadedAt) {
		this.pdfUploadedAt = pdfUploadedAt;
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
	
}
