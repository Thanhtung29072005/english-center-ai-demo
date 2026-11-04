package com.webthuctapcoso.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import com.webthuctapcoso.model.ClassDTO;
import com.webthuctapcoso.model.LessonDTO;
import com.webthuctapcoso.model.DailyCommentDTO;
import com.webthuctapcoso.model.ExamDTO;
import com.webthuctapcoso.model.ExamResultDTO;
import com.webthuctapcoso.service.ParentService;
import com.webthuctapcoso.repository.UserRepository;
import com.webthuctapcoso.repository.entity.UserEntity;
import com.nimbusds.jwt.SignedJWT;

@RestController
@RequestMapping("/api/parent")
public class ParentAPI {
	@Autowired
	private ParentService parentService;
	@Autowired
	private UserRepository userRepository;
	
	@GetMapping("/my-classes")
	public List<ClassDTO> getMyClasses(@RequestHeader("Authorization") String authHeader) {
		Integer userId = getUserIdFromToken(authHeader);
		return parentService.getClassesByParentUserId(userId);
	}
	
	@GetMapping("/my-lessons")
	public List<LessonDTO> getMyLessons(@RequestHeader("Authorization") String authHeader) {
		Integer userId = getUserIdFromToken(authHeader);
		return parentService.getLessonsByParentUserId(userId);
	}
	
	@GetMapping("/my-reviews")
	public List<DailyCommentDTO> getMyReviews(@RequestHeader("Authorization") String authHeader) {
		Integer userId = getUserIdFromToken(authHeader);
		return parentService.getReviewsByParentUserId(userId);
	}
	
	@GetMapping("/my-exams")
	public List<ExamDTO> getMyExams(@RequestHeader("Authorization") String authHeader) {
		Integer userId = getUserIdFromToken(authHeader);
		return parentService.getExamsByParentUserId(userId);
	}
	
	@GetMapping("/my-exam-results")
	public List<ExamResultDTO> getMyExamResults(@RequestHeader("Authorization") String authHeader) {
		Integer userId = getUserIdFromToken(authHeader);
		return parentService.getExamResultsByParentUserId(userId);
	}
	
	private Integer getUserIdFromToken(String authHeader) {
		try {
			// Remove "Bearer " prefix
			String token = authHeader.replace("Bearer ", "");
			
			// Parse JWT token
			SignedJWT signedJWT = SignedJWT.parse(token);
			String username = signedJWT.getJWTClaimsSet().getSubject();
			
			// Get user from database
			UserEntity user = userRepository.findByUsername(username)
				.orElseThrow(() -> new RuntimeException("User not found"));
			
			return user.getId();
		} catch (Exception e) {
			throw new RuntimeException("Failed to extract user ID from token", e);
		}
	}
}
