package com.webthuctapcoso.repository.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

@Entity
@Table(name = "lessons")
public class LessonEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "class_id")
	private ClassEntity classEntity;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name ="teacher_id")
	private TeacherEntity teacherEntity;
	@Column(name="lesson_date")
	private LocalDate lessonDate;
	@Column(name="lesson_number")
	private Integer lessonNumber;
	@Column(name="vocabulary")
	private String vocabulary;
	@Column(name="homework")
	private String homework;
	@Column(name="grammar")
	private String grammar;
	@Column(name="content")
	private String content;
	@Column(name="general_comment")
	private String generalComment;
	@Column(name="material_file_name")
	private String materialFileName;
	@Column(name="material_file_url")
	private String materialFileUrl;
	@Column(name="material_uploaded_at")
	private LocalDateTime materialUploadedAt;
	@Column(name="created_at")
	private LocalDateTime createdAt;
	@PrePersist
	public void prePersist() {
	    createdAt = LocalDateTime.now();
	}
	@OneToMany(mappedBy = "lessonEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DailyCommentEntity> dailyComments = new ArrayList<>();
	
	public List<DailyCommentEntity> getDailyComments() {
		return dailyComments;
	}
	public void setDailyComments(List<DailyCommentEntity> dailyComments) {
		this.dailyComments = dailyComments;
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
	public LocalDate getLessonDate() {
		return lessonDate;
	}
	public void setLessonDate(LocalDate lessonDate) {
		this.lessonDate = lessonDate;
	}
	public Integer getLessonNumber() {
		return lessonNumber;
	}
	public void setLessonNumber(Integer lessonNumber) {
		this.lessonNumber = lessonNumber;
	}
	public String getVocabulary() {
		return vocabulary;
	}
	public void setVocabulary(String vocabulary) {
		this.vocabulary = vocabulary;
	}
	public String getHomework() {
		return homework;
	}
	public void setHomework(String homework) {
		this.homework = homework;
	}
	public String getGrammar() {
		return grammar;
	}
	public void setGrammar(String grammar) {
		this.grammar = grammar;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getGeneralComment() {
		return generalComment;
	}
	public void setGeneralComment(String generalComment) {
		this.generalComment = generalComment;
	}
	public String getMaterialFileName() {
		return materialFileName;
	}
	public void setMaterialFileName(String materialFileName) {
		this.materialFileName = materialFileName;
	}
	public String getMaterialFileUrl() {
		return materialFileUrl;
	}
	public void setMaterialFileUrl(String materialFileUrl) {
		this.materialFileUrl = materialFileUrl;
	}
	public LocalDateTime getMaterialUploadedAt() {
		return materialUploadedAt;
	}
	public void setMaterialUploadedAt(LocalDateTime materialUploadedAt) {
		this.materialUploadedAt = materialUploadedAt;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	
	
}
