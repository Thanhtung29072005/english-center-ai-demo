package com.webthuctapcoso.api;
import java.util.*;
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

import com.webthuctapcoso.model.CreateTeacherRequestDTO;
import com.webthuctapcoso.model.TeacherDTO;
import com.webthuctapcoso.model.UpdateTeacherRequestDTO;
import com.webthuctapcoso.service.TeacherService;

@RestController
@RequestMapping("/api/teachers")
public class TeacherAPI {
	@Autowired
	private TeacherService teacherService;
	@GetMapping
	public List<TeacherDTO> getAllTeachers(){
		return teacherService.findAll();
	}
	@GetMapping("/branch/{branchId}")
	public List<TeacherDTO> getTeachersByBranchId(@PathVariable Integer branchId){
		return teacherService.findByBranchId(branchId);
	}
	@GetMapping("/{id}")
	public TeacherDTO getTeacherById(@PathVariable Integer id) {
		return teacherService.findById(id);
	}
	@PostMapping
	public TeacherDTO createTeacher(@RequestBody CreateTeacherRequestDTO request) {
		return teacherService.createTeacher(request);
	}
	@PutMapping("/{id}")
	public TeacherDTO updateTeacher(@PathVariable Integer id,@RequestBody UpdateTeacherRequestDTO request) {
		return teacherService.updateTeacher(id, request);
	}
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteTeacher(@PathVariable Integer id) {
	    teacherService.deleteTeacher(id);
	    return ResponseEntity.noContent().build();
	}
	
}
