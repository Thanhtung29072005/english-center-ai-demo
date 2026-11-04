package com.webthuctapcoso.model;

public class ExamResultRequestDTO {
	private Integer studentId;
	private Integer examId;
	private String speakingScore;
	private String listeningScore;
	private String readingWritingScore;
	private String comment;
	public Integer getStudentId() {
		return studentId;
	}
	public void setStudentId(Integer studentId) {
		this.studentId = studentId;
	}
	public Integer getExamId() {
		return examId;
	}
	public void setExamId(Integer examId) {
		this.examId = examId;
	}
	public String getSpeakingScore() {
		return speakingScore;
	}
	public void setSpeakingScore(String speakingScore) {
		this.speakingScore = speakingScore;
	}
	public String getListeningScore() {
		return listeningScore;
	}
	public void setListeningScore(String listeningScore) {
		this.listeningScore = listeningScore;
	}
	public String getReadingWritingScore() {
		return readingWritingScore;
	}
	public void setReadingWritingScore(String readingWritingScore) {
		this.readingWritingScore = readingWritingScore;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
