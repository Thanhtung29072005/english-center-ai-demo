package com.webthuctapcoso.api;
import java.util.*;

import com.webthuctapcoso.model.CreateStudentRequestDTO;
import com.webthuctapcoso.model.StudentDTO;
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

import com.webthuctapcoso.service.StudentService;

@RestController
@RequestMapping("/api/students")
public class StudentAPI {
	@Autowired
	private StudentService studentService;
	@GetMapping
	public List<StudentDTO> getAllStudents(){
		return studentService.findAll();
	}
	@PostMapping
	public StudentDTO createStudent(@RequestBody CreateStudentRequestDTO request) {
		return studentService.createStudent(request);
	}
	@GetMapping("/class/{classId}")
	public List<StudentDTO> getStudentsByClassId(@PathVariable Integer classId){
		return studentService.findByClassId(classId);
	}
	@GetMapping("/{id}")
	public StudentDTO getStudentById(@PathVariable Integer id) {
		return studentService.findById(id);
	}
	@PutMapping("/{id}")
	public StudentDTO updateStudent(@PathVariable Integer id, @RequestBody CreateStudentRequestDTO request) {
		return studentService.updateStudent(id, request);
	}
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteStudent(@PathVariable Integer id) {
	    studentService.deleteStudent(id);
	    return ResponseEntity.noContent().build();
	}
}
