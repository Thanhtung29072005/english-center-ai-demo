package com.webthuctapcoso.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestBody;
import com.webthuctapcoso.model.CreateLessonRequestDTO;
import java.util.List;
import com.webthuctapcoso.model.LessonDTO;
import com.webthuctapcoso.service.LessonService;

@RestController
@RequestMapping("/api/lessons")
public class LessonAPI {
	@Autowired
	private LessonService lessonService;
	@GetMapping
	public List<LessonDTO> getAllLessons() {
		return lessonService.fillAll();
	}
	@PostMapping
	public LessonDTO createLesson(@RequestBody CreateLessonRequestDTO request) {
		return lessonService.createLesson(request);
	}
	@GetMapping("/class/{classId}")
	public List<LessonDTO> getLessonsByClassId(@org.springframework.web.bind.annotation.PathVariable Integer classId) {
		return lessonService.findByClassEntityId(classId);
	}
	@GetMapping("/class/{classId}/recent")
	public List<LessonDTO> getRecentLessons(@PathVariable Integer classId) {
	    return lessonService.findByClassEntityId(classId);
	}
	@GetMapping("/{id}")
    public LessonDTO getById(@PathVariable Integer id) {
        return lessonService.findById(id);
    }
	@PutMapping("/{id}")
    public LessonDTO update(@PathVariable Integer id, @RequestBody CreateLessonRequestDTO request) {
        return lessonService.updateLesson(id, request);
    }
	@PostMapping("/{id}/material")
    public LessonDTO uploadMaterial(@PathVariable Integer id, @RequestParam("file") MultipartFile file) {
        return lessonService.uploadMaterial(id, file);
    }
	@DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }
}
