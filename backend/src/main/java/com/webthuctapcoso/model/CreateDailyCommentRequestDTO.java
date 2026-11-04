package com.webthuctapcoso.model;

public class CreateDailyCommentRequestDTO {
	private Integer lessonId;
	private Integer studentId;
	private String vocabularyScore;
	private String schoolExamScore;
	private String homeworkStatus;
	private String comment;
	public Integer getLessonId() {
		return lessonId;
	}
	public void setLessonId(Integer lessonId) {
		this.lessonId = lessonId;
	}
	public Integer getStudentId() {
		return studentId;
	}
	public void setStudentId(Integer studentId) {
		this.studentId = studentId;
	}
	public String getVocabularyScore() {
		return vocabularyScore;
	}
	public void setVocabularyScore(String vocabularyScore) {
		this.vocabularyScore = vocabularyScore;
	}
	public String getSchoolExamScore() {
		return schoolExamScore;
	}
	public void setSchoolExamScore(String schoolExamScore) {
		this.schoolExamScore = schoolExamScore;
	}
	public String getHomeworkStatus() {
		return homeworkStatus;
	}
	public void setHomeworkStatus(String homeworkStatus) {
		this.homeworkStatus = homeworkStatus;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
}
