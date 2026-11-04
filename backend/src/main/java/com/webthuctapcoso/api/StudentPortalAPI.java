package com.webthuctapcoso.api;

import com.nimbusds.jwt.SignedJWT;
import com.webthuctapcoso.model.ClassDTO;
import com.webthuctapcoso.model.DailyCommentDTO;
import com.webthuctapcoso.model.ExamDTO;
import com.webthuctapcoso.model.ExamResultDTO;
import com.webthuctapcoso.model.LessonDTO;
import com.webthuctapcoso.repository.UserRepository;
import com.webthuctapcoso.repository.entity.UserEntity;
import com.webthuctapcoso.service.StudentPortalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class StudentPortalAPI {
	@Autowired
	private StudentPortalService studentPortalService;
	@Autowired
	private UserRepository userRepository;

	@GetMapping("/me")
	public Map<String, Object> getMe(@RequestHeader("Authorization") String authHeader) {
		Integer userId = getUserIdFromToken(authHeader);
		Integer studentId = studentPortalService.getStudentIdByUserId(userId);
		Map<String, Object> result = new HashMap<>();
		result.put("userId", userId);
		result.put("studentId", studentId);
		return result;
	}

	@GetMapping("/my-classes")
	public List<ClassDTO> getMyClasses(@RequestHeader("Authorization") String authHeader) {
		Integer userId = getUserIdFromToken(authHeader);
		return studentPortalService.getClassesByStudentUserId(userId);
	}

	@GetMapping("/my-lessons")
	public List<LessonDTO> getMyLessons(@RequestHeader("Authorization") String authHeader) {
		Integer userId = getUserIdFromToken(authHeader);
		return studentPortalService.getLessonsByStudentUserId(userId);
	}

	@GetMapping("/my-reviews")
	public List<DailyCommentDTO> getMyReviews(@RequestHeader("Authorization") String authHeader) {
		Integer userId = getUserIdFromToken(authHeader);
		return studentPortalService.getReviewsByStudentUserId(userId);
	}

	@GetMapping("/my-exams")
	public List<ExamDTO> getMyExams(@RequestHeader("Authorization") String authHeader) {
		Integer userId = getUserIdFromToken(authHeader);
		return studentPortalService.getExamsByStudentUserId(userId);
	}

	@GetMapping("/my-exam-results")
	public List<ExamResultDTO> getMyExamResults(@RequestHeader("Authorization") String authHeader) {
		Integer userId = getUserIdFromToken(authHeader);
		return studentPortalService.getExamResultsByStudentUserId(userId);
	}

	private Integer getUserIdFromToken(String authHeader) {
		try {
			String token = authHeader.replace("Bearer ", "");
			SignedJWT signedJWT = SignedJWT.parse(token);
			String username = signedJWT.getJWTClaimsSet().getSubject();
			UserEntity user = userRepository.findByUsername(username)
				.orElseThrow(() -> new RuntimeException("User not found"));
			return user.getId();
		} catch (Exception e) {
			throw new RuntimeException("Failed to extract user ID from token", e);
		}
	}
}
