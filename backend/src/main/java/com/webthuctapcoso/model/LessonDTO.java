package com.webthuctapcoso.model;

import java.time.LocalDate;
import java.util.*;
import java.time.LocalDateTime;
import com.webthuctapcoso.repository.valueObjects.GrammarItem;
import com.webthuctapcoso.repository.valueObjects.HomeworkItem;
import com.webthuctapcoso.repository.valueObjects.VocabularyItem;
public class LessonDTO {
	private Integer id;
	private Integer classId;
	private String className;
	private Integer teacherId;
	private String teacherName;
	private LocalDate lessonDate;
	private Integer lessonNumber;
	private List<VocabularyItem> vocabulary;
	private List<HomeworkItem> homework;
	private List<GrammarItem> grammar;
	private String content;
	private String generalComment;
	private String materialFileName;
	private String materialFileUrl;
	private LocalDateTime materialUploadedAt;
	private LocalDateTime createdAt;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getClassId() {
		return classId;
	}
	public void setClassId(Integer classId) {
		this.classId = classId;
	}
	public String getClassName() {
		return className;
	}
	public void setClassName(String className) {
		this.className = className;
	}
	public Integer getTeacherId() {
		return teacherId;
	}
	public void setTeacherId(Integer teacherId) {
		this.teacherId = teacherId;
	}
	public String getTeacherName() {
		return teacherName;
	}
	public void setTeacherName(String teacherName) {
		this.teacherName = teacherName;
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
	public List<VocabularyItem> getVocabulary() {
		return vocabulary;
	}
	public void setVocabulary(List<VocabularyItem> vocabulary) {
		this.vocabulary = vocabulary;
	}
	public List<HomeworkItem> getHomework() {
		return homework;
	}
	public void setHomework(List<HomeworkItem> homework) {
		this.homework = homework;
	}
	public List<GrammarItem> getGrammar() {
		return grammar;
	}
	public void setGrammar(List<GrammarItem> grammar) {
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
