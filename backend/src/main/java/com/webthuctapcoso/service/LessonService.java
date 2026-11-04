package com.webthuctapcoso.service;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import com.webthuctapcoso.model.LessonDTO;
import com.webthuctapcoso.model.CreateLessonRequestDTO;
public interface LessonService {
	List<LessonDTO> fillAll();
	LessonDTO createLesson(CreateLessonRequestDTO request);
	List<LessonDTO> findByClassEntityId(Integer classId);
	List<LessonDTO> findRecentLessonsByClassEntityId(Integer classId);
	LessonDTO findById(Integer id);
	LessonDTO updateLesson(Integer id, CreateLessonRequestDTO request);
	LessonDTO uploadMaterial(Integer id, MultipartFile file);
    void deleteLesson(Integer id);
}
