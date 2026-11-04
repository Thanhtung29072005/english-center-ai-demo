package com.webthuctapcoso.model;

import java.util.List;

public class SubmitExamRequestDTO {
	private List<SubmitAnswerDTO> answers;
	public List<SubmitAnswerDTO> getAnswers() {
		return answers;
	}
	public void setAnswers(List<SubmitAnswerDTO> answers) {
		this.answers = answers;
	}
	
}
