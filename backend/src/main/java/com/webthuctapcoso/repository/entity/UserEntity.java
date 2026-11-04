package com.webthuctapcoso.repository.entity;

import javax.persistence.Entity;

import com.webthuctapcoso.repository.eNum.UserRole;

import java.time.LocalDateTime;

import javax.persistence.*;

@Entity
@Table(name = "users")
public class UserEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@Column(name = "username", nullable = false, unique = true)
	private String username;
	@Column(name = "password_hash", nullable = false)
	private String password;
	@Column(name = "email")
	private String email;
	@Column(name="full_name")
	private String fullName;
	@Column(name = "phone")
	private String phone;
	@Enumerated(EnumType.ORDINAL)
	private UserRole role;
	@Column(name ="is_active",nullable = true)
	private Boolean isActive=true;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "branch_id",nullable = true)
	private BranchEntity branch;
	@OneToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="teacher_id",nullable = true)
	private TeacherEntity teacher;
	@OneToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="student_id",nullable = true)
	private StudentEntity student;
	@Column(name="refresh_token")
	private String refreshToken;
	@Column(name="refresh_token_expiry_time")
	private Long refreshTokenExpiryTime;
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
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public UserRole getRole() {
		return role;
	}
	public void setRole(UserRole role) {
		this.role = role;
	}
	public Boolean getIsActive() {
		return isActive;
	}
	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}
	public BranchEntity getBranch() {
		return branch;
	}
	public void setBranch(BranchEntity branch) {
		this.branch = branch;
	}
	public TeacherEntity getTeacher() {
		return teacher;
	}
	public void setTeacher(TeacherEntity teacher) {
		this.teacher = teacher;
	}
	public StudentEntity getStudent() {
		return student;
	}
	public void setStudent(StudentEntity student) {
		this.student = student;
	}
	public String getRefreshToken() {
		return refreshToken;
	}
	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}
	public Long getRefreshTokenExpiryTime() {
		return refreshTokenExpiryTime;
	}
	public void setRefreshTokenExpiryTime(Long refreshTokenExpiryTime) {
		this.refreshTokenExpiryTime = refreshTokenExpiryTime;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	
}


