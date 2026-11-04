package com.webthuctapcoso.repository.entity;

import java.time.LocalDateTime;

import javax.persistence.*;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "student_parents")
public class StudentParentEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "student_id", nullable = false)
	private StudentEntity studentEntity;
	@Column(name="parent_user_id", nullable = false)
	private Integer parentUserId;
	@Column(name="created_at")
	private LocalDateTime createdAt;
	@PrePersist
	public void prePersist() {
		createdAt = LocalDateTime.now();
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public StudentEntity getStudentEntity() {
		return studentEntity;
	}
	public void setStudentEntity(StudentEntity studentEntity) {
		this.studentEntity = studentEntity;
	}
	public Integer getParentUserId() {
		return parentUserId;
	}
	public void setParentUserId(Integer parentUserId) {
		this.parentUserId = parentUserId;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	
}
