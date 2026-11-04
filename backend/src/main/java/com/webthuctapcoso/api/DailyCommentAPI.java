package com.webthuctapcoso.api;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import com.webthuctapcoso.model.DailyCommentDTO;
import org.springframework.beans.factory.annotation.Autowired;
@RestController
@RequestMapping("/api/Comments")
public class DailyCommentAPI {
	@Autowired
	private com.webthuctapcoso.service.DailyCommentService dailyCommentService;
	@GetMapping("/lesson/{lessonId}")
	public List<DailyCommentDTO> getDailyCommentsByLessonId(@PathVariable Integer lessonId) {
	    return dailyCommentService.getDailyCommentsByLessonId(lessonId);
	}
	@GetMapping("/student/{studentId}")
	public List<DailyCommentDTO> getDailyCommentsByStudentId(@PathVariable Integer studentId) {
	    return dailyCommentService.getDailyCommentsByStudentId(studentId);
	}
	@GetMapping("/{id}")
	public DailyCommentDTO getDailyCommentById(@PathVariable Integer id) {
	    return dailyCommentService.getDailyCommentById(id);
	}
	@PostMapping
	public DailyCommentDTO createDailyComment(@RequestBody DailyCommentDTO dailyCommentDTO) {
	    return dailyCommentService.createDailyComment(dailyCommentDTO);
	}
	@PutMapping("/{id}")
	public DailyCommentDTO updateDailyComment(@PathVariable Integer id, @RequestBody DailyCommentDTO dailyCommentDTO) {
	    return dailyCommentService.updateDailyComment(id, dailyCommentDTO);
	}
	@DeleteMapping("/{id}")
	public void deleteDailyComment(@PathVariable Integer id) {
	    dailyCommentService.deleteDailyComment(id);
	}
	
}
