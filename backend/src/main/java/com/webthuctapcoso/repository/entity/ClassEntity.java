package com.webthuctapcoso.repository.entity;

import java.time.LocalDateTime;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import java.util.*;
@Entity
@Table(name ="classes")
public class ClassEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@Column(name ="name",nullable = false)
	private String name;
	@Column(name ="level")
	private String level;
	@Column(name="price", nullable = false)
	private java.math.BigDecimal price;
	@Column(name="created_at")
	private LocalDateTime createdAt;
	@Column(name="is_completed")
	private Boolean isCompleted;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="branch_id",nullable = false)
	private BranchEntity branchEntity;
	@OneToMany(mappedBy = "classEntity",fetch = FetchType.LAZY,cascade = CascadeType.ALL,orphanRemoval = true)
	private List<ClassTeacherEntity> classTeachers =new ArrayList<>();
	@OneToMany(mappedBy = "classEntity",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
	private List<StudentEntity> students = new ArrayList<>();
	@PrePersist
	public void prePersist() {
		createdAt = LocalDateTime.now();
	}
	@OneToMany(mappedBy="classEntity",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
	private List<LessonEntity> lessons = new ArrayList<>();
	public List<LessonEntity> getLessons() {
		return lessons;
	}
	public void setLessons(List<LessonEntity> lessons) {
		this.lessons = lessons;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getLevel() {
		return level;
	}
	public void setLevel(String level) {
		this.level = level;
	}
	public java.math.BigDecimal getPrice() {
		return price;
	}
	public void setPrice(java.math.BigDecimal price) {
		this.price = price;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public Boolean getIsCompleted() {
		return isCompleted;
	}
	public void setIsCompleted(Boolean isCompleted) {
		this.isCompleted = isCompleted;
	}
	public BranchEntity getBranchEntity() {
		return branchEntity;
	}
	public void setBranchEntity(BranchEntity branchEntity) {
		this.branchEntity = branchEntity;
	}
	public List<ClassTeacherEntity> getClassTeachers() {
		return classTeachers;
	}
	public void setClassTeachers(List<ClassTeacherEntity> classTeachers) {
		this.classTeachers = classTeachers;
	}
	public List<StudentEntity> getStudents() {
		return students;
	}
	public void setStudents(List<StudentEntity> students) {
		this.students = students;
	}
	
}
