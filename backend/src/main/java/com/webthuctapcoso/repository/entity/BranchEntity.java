package com.webthuctapcoso.repository.entity;

import javax.persistence.Entity;

import java.time.LocalDateTime;

import javax.persistence.*;
import java.util.*;
import javax.persistence.CascadeType;
@Entity
@Table(name = "branches")
public class BranchEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@Column(name = "name")
	private String name;
	@Column(name = "address")
	private String address;
	@Column(name = "phone")
	private String phone;
	@Column(name = "created_at")
	private LocalDateTime createdAt;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "owner_id",nullable = false)
	private OwnerEntity owner;
	@PrePersist
	public void prePersist() {
		createdAt = LocalDateTime.now();
	}
	@OneToMany(mappedBy = "branchEntity", cascade = CascadeType.ALL)
    private List<ClassEntity> classes = new ArrayList<>();
	@OneToMany(mappedBy = "branch", cascade = CascadeType.ALL)
    private List<TeacherEntity> teachers = new ArrayList<>();
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
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
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
	public OwnerEntity getOwner() {
		return owner;
	}
	public void setOwner(OwnerEntity owner) {
		this.owner = owner;
	}
	public List<ClassEntity> getClasses() {
		return classes;
	}
	public void setClasses(List<ClassEntity> classes) {
		this.classes = classes;
	}
	public List<TeacherEntity> getTeachers() {
		return teachers;
	}
	public void setTeachers(List<TeacherEntity> teachers) {
		this.teachers = teachers;
	}
	
}
