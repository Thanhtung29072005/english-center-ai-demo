package com.webthuctapcoso.service;

import java.util.*;
import com.webthuctapcoso.model.ClassDTO;
import com.webthuctapcoso.model.LessonDTO;
import com.webthuctapcoso.model.DailyCommentDTO;
import com.webthuctapcoso.model.ExamDTO;
import com.webthuctapcoso.model.ExamResultDTO;

public interface ParentService {
	List<ClassDTO> getClassesByParentUserId(Integer parentUserId);
	List<LessonDTO> getLessonsByParentUserId(Integer parentUserId);
	List<DailyCommentDTO> getReviewsByParentUserId(Integer parentUserId);
	List<ExamDTO> getExamsByParentUserId(Integer parentUserId);
	List<ExamResultDTO> getExamResultsByParentUserId(Integer parentUserId);
}
