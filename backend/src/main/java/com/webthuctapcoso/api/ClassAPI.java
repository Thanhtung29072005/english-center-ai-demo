package com.webthuctapcoso.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;
import com.webthuctapcoso.model.ClassDTO;
import com.webthuctapcoso.model.CreateClassRequestDTO;
import com.webthuctapcoso.model.UpdateClassRequestDTO;
import com.webthuctapcoso.service.ClassService;

@RestController
@RequestMapping("/api/classes")
public class ClassAPI {
	@Autowired
	private ClassService classService;
	
	@GetMapping("/branch/{branchId}")
	public List<ClassDTO> getClassByBranchId(@PathVariable Integer branchId){
		return classService.findByBranchId(branchId);
	}
	@GetMapping("/{id}")
	public ClassDTO getClassById(@PathVariable Integer id) {
		return classService.findById(id);
	}
	@PostMapping
	public ResponseEntity<ClassDTO> createClass(@RequestBody CreateClassRequestDTO request) {
	    ClassDTO created = classService.createClass(request);
	    return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}
	@PutMapping("/{id}")
	public ClassDTO updateClass(@PathVariable Integer id,@RequestBody UpdateClassRequestDTO updateClassRequestDTO) {
		return classService.updateClass(id, updateClassRequestDTO);
	}
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteClass(@PathVariable Integer id) {
	    classService.deleteClass(id);
	    return ResponseEntity.noContent().build();
	}
//	Tìm tất cả các lớp học 
	@GetMapping
	public List<ClassDTO> getAllClasses() {
	    return classService.findAll();
	}
//	Lấy danh sách lớp học theo giáo viên
	@GetMapping("/teacher/{teacherId}")
	public List<ClassDTO> getClassesByTeacherId(@PathVariable Integer teacherId) {
	    return classService.findByTeacherId(teacherId);
	}
//	Cập nhật trạng thái hoàn thành của lớp học
	@PatchMapping("/{id}/complete")
	public ClassDTO markClassAsCompleted(@PathVariable Integer id) {
	    UpdateClassRequestDTO updateRequest = new UpdateClassRequestDTO();
	    updateRequest.setIsCompleted(true);
	    return classService.updateClass(id, updateRequest);
	}
//	Gán giáo viên cho lớp học
	@PostMapping("/{classId}/teachers/{teacherId}")
	public ResponseEntity<Void> assignTeacherToClass(@PathVariable Integer classId, @PathVariable Integer teacherId) {
	    classService.assignTeacher(classId, teacherId);
	    return ResponseEntity.ok().build();
	}
//	Bỏ gán giáo viên khỏi lớp học
	@DeleteMapping("/{classId}/teachers/{teacherId}")
	public ResponseEntity<Void> removeTeacherFromClass(@PathVariable Integer classId, @PathVariable Integer teacherId) {
	    classService.removeTeacher(classId, teacherId);
	    return ResponseEntity.ok().build();
	}
}
