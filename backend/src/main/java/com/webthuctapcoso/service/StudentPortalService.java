package com.webthuctapcoso.service;

import java.util.List;

import com.webthuctapcoso.model.ClassDTO;
import com.webthuctapcoso.model.DailyCommentDTO;
import com.webthuctapcoso.model.ExamDTO;
import com.webthuctapcoso.model.ExamResultDTO;
import com.webthuctapcoso.model.LessonDTO;

public interface StudentPortalService {
	Integer getStudentIdByUserId(Integer userId);
	List<ClassDTO> getClassesByStudentUserId(Integer userId);
	List<LessonDTO> getLessonsByStudentUserId(Integer userId);
	List<DailyCommentDTO> getReviewsByStudentUserId(Integer userId);
	List<ExamDTO> getExamsByStudentUserId(Integer userId);
	List<ExamResultDTO> getExamResultsByStudentUserId(Integer userId);
}
