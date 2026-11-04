package com.webthuctapcoso.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.webthuctapcoso.repository.entity.DailyCommentEntity;
public interface DailyCommentRepository extends JpaRepository<DailyCommentEntity, Integer> {
	List<DailyCommentEntity> findByLessonEntity_Id(Integer lessonId);
	List<DailyCommentEntity> findByStudentEntity_Id(Integer studentId);
	void deleteByLessonEntity_Id(Integer lessonId);
	boolean existsByLessonEntity_IdAndStudentEntity_Id(Integer lessonId, Integer studentId);
	
}
