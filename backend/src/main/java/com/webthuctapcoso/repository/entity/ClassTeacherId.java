package com.webthuctapcoso.repository.entity;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Embeddable;

@Embeddable
public class ClassTeacherId implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer classId;
    private Integer teacherId;

    public ClassTeacherId() {
    }

    public ClassTeacherId(Integer classId, Integer teacherId) {
        this.classId = classId;
        this.teacherId = teacherId;
    }

    public Integer getClassId() {
        return classId;
    }

    public void setClassId(Integer classId) {
        this.classId = classId;
    }

    public Integer getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ClassTeacherId)) return false;
        ClassTeacherId that = (ClassTeacherId) o;
        return Objects.equals(classId, that.classId) &&
               Objects.equals(teacherId, that.teacherId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(classId, teacherId);
    }
}