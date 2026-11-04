package com.webthuctapcoso.repository.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "students")
public class StudentEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@Column(name = "name", nullable = false)
	private String name;
	@Column(name= "date_of_birth")
	private LocalDate dateOfBirth;
	@Column(name="parent_name")
	private String parentName;
	@Column(name="parent_phone")
	private String parentPhone;
	@Column(name="parent_email")
	private String parentEmail;
	@Column(name="created_at")
	private LocalDateTime createdAt;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "class_id",nullable = false)
	private ClassEntity classEntity;
	@PrePersist
	public void prePersist() {
		createdAt = LocalDateTime.now();
	}
	@OneToMany(mappedBy = "studentEntity",fetch = FetchType.LAZY,cascade = CascadeType.ALL,orphanRemoval = true)
	@JsonIgnore
	private List<StudentParentEntity> studentParents = new ArrayList<>();
	@OneToMany(mappedBy = "studentEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
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
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}
	public void setDateOfBirth(LocalDate dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}
	public String getParentName() {
		return parentName;
	}
	public void setParentName(String parentName) {
		this.parentName = parentName;
	}
	public String getParentPhone() {
		return parentPhone;
	}
	public void setParentPhone(String parentPhone) {
		this.parentPhone = parentPhone;
	}
	public String getParentEmail() {
		return parentEmail;
	}
	public void setParentEmail(String parentEmail) {
		this.parentEmail = parentEmail;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public ClassEntity getClassEntity() {
		return classEntity;
	}
	public void setClassEntity(ClassEntity classEntity) {
		this.classEntity = classEntity;
	}
	public List<StudentParentEntity> getStudentParents() {
		return studentParents;
	}
	public void setStudentParents(List<StudentParentEntity> studentParents) {
		this.studentParents = studentParents;
	}
	
	
}
