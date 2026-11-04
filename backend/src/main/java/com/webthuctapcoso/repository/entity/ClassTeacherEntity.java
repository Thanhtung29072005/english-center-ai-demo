package com.webthuctapcoso.repository.entity;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.*;
import javax.persistence.Table;

@Entity
@Table(name="class_teachers")
public class ClassTeacherEntity {
	@EmbeddedId
	private ClassTeacherId id;
	
	@ManyToOne
	@MapsId("classId")
	@JoinColumn(name="class_id")
	private ClassEntity classEntity;
	
	@ManyToOne
	@MapsId("teacherId")
	@JoinColumn(name="teacher_id")
	private TeacherEntity teacherEntity;

	public ClassTeacherId getId() {
		return id;
	}

	public void setId(ClassTeacherId id) {
		this.id = id;
	}

	public ClassEntity getClassEntity() {
		return classEntity;
	}

	public void setClassEntity(ClassEntity classEntity) {
		this.classEntity = classEntity;
	}

	public TeacherEntity getTeacherEntity() {
		return teacherEntity;
	}

	public void setTeacherEntity(TeacherEntity teacherEntity) {
		this.teacherEntity = teacherEntity;
	}
	
	
	
}
