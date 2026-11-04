package com.webthuctapcoso.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.webthuctapcoso.repository.entity.LessonEntity;
import java.util.List;
public interface LessonRepository extends JpaRepository<LessonEntity, Integer> {
	List<LessonEntity> findByTeacherEntityId(Integer teacherId);
	List<LessonEntity> findByClassEntityId(Integer classId);
	List<LessonEntity> findTop3ByClassEntityIdOrderByLessonDateDescLessonNumberDesc(Integer classId);
	
}
