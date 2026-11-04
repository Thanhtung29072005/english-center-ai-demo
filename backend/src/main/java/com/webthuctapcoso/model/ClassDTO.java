package com.webthuctapcoso.model;
import java.util.*;
public class ClassDTO {
	private Integer id;
	private String name;
	private String level;
	private Boolean isCompleted;
	private java.math.BigDecimal price;
	
	private Integer branchId;
	private String branchName;
	private List<ClassTeacherDTO> teachers = new ArrayList<>();
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
	public Boolean getIsCompleted() {
		return isCompleted;
	}
	public void setIsCompleted(Boolean isCompleted) {
		this.isCompleted = isCompleted;
	}
	public java.math.BigDecimal getPrice() {
		return price;
	}
	public void setPrice(java.math.BigDecimal price) {
		this.price = price;
	}
	public Integer getBranchId() {
		return branchId;
	}
	public void setBranchId(Integer branchId) {
		this.branchId = branchId;
	}
	public String getBranchName() {
		return branchName;
	}
	public void setBranchName(String branchName) {
		this.branchName = branchName;
	}
	public List<ClassTeacherDTO> getTeachers() {
		return teachers;
	}
	public void setTeachers(List<ClassTeacherDTO> teachers) {
		this.teachers = teachers;
	}
	
}
