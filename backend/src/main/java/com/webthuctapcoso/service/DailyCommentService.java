package com.webthuctapcoso.service;
import java.util.List;
import com.webthuctapcoso.model.DailyCommentDTO;
public interface DailyCommentService {
	List<DailyCommentDTO> getDailyCommentsByLessonId(Integer lessonId);
	List<DailyCommentDTO> getDailyCommentsByStudentId(Integer studentId);
	DailyCommentDTO createDailyComment(DailyCommentDTO dailyCommentDTO);
	DailyCommentDTO updateDailyComment(Integer id, DailyCommentDTO dailyCommentDTO);
	DailyCommentDTO getDailyCommentById(Integer id);
	void deleteDailyComment(Integer id);
}
