package com.webthuctapcoso.repository.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.*;
@Entity
@Table(name="teachers")
public class TeacherEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@Column(name ="name",nullable = false)
	private String name;
	@Column(name="email",nullable = false,unique=true)
	private String email;
	@Column(name="phone")
	private String phone;
	@Column(name="created_at")
	private LocalDateTime createdAt;
	@ManyToOne(fetch =FetchType.LAZY)
	@JoinColumn(name="branch_id",nullable = false)
	private BranchEntity branch;
	@PrePersist
	public void prePersist(){
	    this.createdAt = LocalDateTime.now();
	}
	@OneToMany(mappedBy = "teacherEntity", fetch = FetchType.LAZY)
	private List<ClassTeacherEntity> classTeachers = new ArrayList<>();
	@JsonIgnore
	@OneToMany(mappedBy="teacherEntity",fetch = FetchType.LAZY)
	private List<LessonEntity> lessons = new ArrayList<>();
	public List<LessonEntity> getLessons() {
		return lessons;
	}
	@OneToOne(mappedBy = "teacher", fetch = FetchType.LAZY) 
	private UserEntity userEntity;
	
	public UserEntity getUserEntity() {
		return userEntity;
	}
	public void setUserEntity(UserEntity userEntity) {
		this.userEntity = userEntity;
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
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public BranchEntity getBranch() {
		return branch;
	}
	public void setBranch(BranchEntity branch) {
		this.branch = branch;
	}
	public List<ClassTeacherEntity> getClassTeachers() {
		return classTeachers;
	}
	public void setClassTeachers(List<ClassTeacherEntity> classTeachers) {
		this.classTeachers = classTeachers;
	}
	
	
}
