package com.webthuctapcoso.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.webthuctapcoso.model.CreateUserRequest;
import com.webthuctapcoso.model.ResetPasswordRequest;
import com.webthuctapcoso.model.StudentDTO;
import com.webthuctapcoso.model.UserDTO;
import com.webthuctapcoso.service.UserService;

import java.util.*;

@RestController
@RequestMapping("/api/Users")
public class UserAPI {
	@Autowired
	private UserService userService;
	@PostMapping
	public UserDTO createUser(@RequestBody CreateUserRequest request) {
		return userService.createUser(request);
	}
	@GetMapping
	public List<UserDTO> getAllUsers() {
		return userService.findAll();
	}
	@DeleteMapping("/{id}")
	public void deleteUser(@PathVariable Integer id) {
		userService.deleteUser(id);
	}
	@GetMapping("/{id}")
	public UserDTO getUserById(@PathVariable Integer id) {
		return userService.findById(id);
	}
	@PutMapping("/{id}")
	public UserDTO updateUser(@PathVariable Integer id, @RequestBody CreateUserRequest request) {
		return userService.updateUser(id, request);
	}
	@PostMapping("/{id}/reset-password")
	public void resetPassword(@PathVariable Integer id, @RequestBody ResetPasswordRequest newPassword) {
		userService.resetPassword(id, newPassword);
	}
	@GetMapping("/{parentId}/students")
	public List<StudentDTO> getStudentsByParentId(@PathVariable Integer parentId) {
		return userService.getStudentsByParentId(parentId);
	}
	@PostMapping("/{parentId}/students")
	public void assignStudentsToParent(@PathVariable Integer parentId, @RequestBody List<Integer> studentIds) {
		userService.assignStudentsToParent(parentId, studentIds);
	}
	@PostMapping("/{id}/activate")
	public ResponseEntity<String> activateUser(@PathVariable Integer id) {
	    userService.activateUser(id);
	    return ResponseEntity.ok("Kích hoạt tài khoản thành công!");
	}

	@PostMapping("/{id}/deactivate")
	public ResponseEntity<String> deactivateUser(@PathVariable Integer id) {
	    userService.deactivateUser(id);
	    return ResponseEntity.ok("Vô hiệu hóa tài khoản thành công!");
	}
}
