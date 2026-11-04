package com.webthuctapcoso.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
//import java.util.*;

public class StudentDTO {
	private Integer id;
	private String name;
	private LocalDate dateOfBirth;
	private String parentName;
	private String parentPhone;
	private String parentEmail;
	private Integer classId;
	private String className;
	private LocalDateTime createdAt;
//	private List<Integer> parentUserIds= new ArrayList<>();
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
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
//	public List<Integer> getParentUserIds() {
//		return parentUserIds;
//	}
//	public void setParentUserIds(List<Integer> parentUserIds) {
//		this.parentUserIds = parentUserIds;
//	}
	
}
