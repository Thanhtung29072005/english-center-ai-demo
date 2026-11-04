package com.webthuctapcoso.model;
import java.util.*;
public class CreateClassRequestDTO {
	private String name;
	private String level;
	private Integer branchId;
	private List<Integer> teacherIds;
	private java.math.BigDecimal price;
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
	public Integer getBranchId() {
		return branchId;
	}
	public void setBranchId(Integer branchId) {
		this.branchId = branchId;
	}
	public List<Integer> getTeacherIds() {
		return teacherIds;
	}
	public void setTeacherIds(List<Integer> teacherIds) {
		this.teacherIds = teacherIds;
	}
	public java.math.BigDecimal getPrice() {
		return price;
	}
	public void setPrice(java.math.BigDecimal price) {
		this.price = price;
	}
	
}
