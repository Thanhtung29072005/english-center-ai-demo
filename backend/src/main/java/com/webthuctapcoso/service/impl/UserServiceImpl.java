package com.webthuctapcoso.service.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.*;
import com.webthuctapcoso.model.CreateUserRequest;
import com.webthuctapcoso.model.ResetPasswordRequest;
import com.webthuctapcoso.model.StudentDTO;
import com.webthuctapcoso.model.UserDTO;
import com.webthuctapcoso.service.UserService;
import com.webthuctapcoso.converter.StudentDTOConverter;
import com.webthuctapcoso.converter.UserDTOConverter;
import com.webthuctapcoso.repository.BranchRepository;
import com.webthuctapcoso.repository.ClassRepository;
import com.webthuctapcoso.repository.UserRepository;
import com.webthuctapcoso.repository.eNum.UserRole;
import com.webthuctapcoso.repository.entity.UserEntity;
import com.webthuctapcoso.repository.entity.BranchEntity;
import com.webthuctapcoso.repository.entity.ClassEntity;
import com.webthuctapcoso.exception.ResourceNotFoundException;
import com.webthuctapcoso.repository.entity.ClassTeacherEntity;
import com.webthuctapcoso.repository.entity.ClassTeacherId;
import com.webthuctapcoso.repository.entity.StudentEntity;
import com.webthuctapcoso.repository.entity.StudentParentEntity;
import com.webthuctapcoso.repository.entity.TeacherEntity;
import com.webthuctapcoso.repository.ClassTeacherRepository;
import com.webthuctapcoso.repository.StudentParentRepository;
import com.webthuctapcoso.repository.StudentRepository;
import com.webthuctapcoso.repository.TeacherRepository;
@Service
public class UserServiceImpl implements UserService {
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private UserDTOConverter userDTOConverter;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private ClassRepository classRepository;
	@Autowired
	private ClassTeacherRepository classTeacherRepository;
	@Autowired
	private TeacherRepository teacherRepository;
	@Autowired
	private BranchRepository branchRepository;
	@Autowired
	private StudentDTOConverter studentDTOConverter;
	@Autowired
	private StudentRepository studentRepository;
	@Autowired
	private StudentParentRepository studentParentRepository;
	@Override
	@Transactional
	public UserDTO createUser(CreateUserRequest request) {
		if(userRepository.existsByUsername(request.getUsername())) {
			throw new IllegalArgumentException("Username already exists");
		}
		if(userRepository.existsByEmail(request.getEmail())) {
			throw new IllegalArgumentException("Email already exists");
		}
		UserEntity userEntity = new UserEntity();
		userEntity.setUsername(request.getUsername());
		userEntity.setEmail(request.getEmail());
		userEntity.setFullName(request.getFullName());
		userEntity.setPhone(request.getPhone());
		userEntity.setPassword(passwordEncoder.encode(request.getPassword()));
		userEntity.setRole(UserRole.valueOf(request.getRole()));
		UserEntity savedUser = userRepository.save(userEntity);
		if(UserRole.TEACHER.name().equals(savedUser.getRole().name())) {
			TeacherEntity teacher = new TeacherEntity();
	        teacher.setUserEntity(userEntity); 
	        teacher.setName(request.getFullName());
	        teacher.setEmail(request.getEmail());
	        teacher.setPhone(request.getPhone());
	        
	        BranchEntity branch = branchRepository.findById(request.getBranchId())
	            .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
	        teacher.setBranch(branch);

	        teacher = teacherRepository.save(teacher); 
	        userEntity.setTeacher(teacher);
			for(Integer classId:request.getClassIds()) {
				ClassEntity classEntity = classRepository.findById(classId).orElseThrow(() -> new ResourceNotFoundException("Class not found"));
				ClassTeacherEntity classTeacherEntity = new ClassTeacherEntity();
				ClassTeacherId classTeacherId = new ClassTeacherId(classId, teacher.getId());
				classTeacherEntity.setId(classTeacherId);
				classTeacherEntity.setClassEntity(classEntity);
				classTeacherEntity.setTeacherEntity(teacher);
				classTeacherRepository.save(classTeacherEntity);
			}
			savedUser.setTeacher(teacher);
		}
		return userDTOConverter.toDTO(savedUser);
	}
	@Override
	public List<UserDTO> findAll() {
		List<UserDTO> result = new ArrayList<>();
		List<UserEntity> userEntities = userRepository.findAll();
		for(UserEntity x:userEntities) {
			result.add(userDTOConverter.toDTO(x));
		}
		return result;
	}
	@Override
	@Transactional
	public void deleteUser(Integer id) {
		UserEntity userEntity =userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
		if(userEntity.getRole() == UserRole.TEACHER) {
			TeacherEntity teacher = userEntity.getTeacher();
			List<ClassTeacherEntity> classTeacherEntities = classTeacherRepository.findByTeacherEntity_Id(teacher.getId());
			classTeacherRepository.deleteAll(classTeacherEntities);
			teacherRepository.delete(teacher);
		}
		userRepository.delete(userEntity);
	}
	@Override
	public UserDTO findById(Integer id) {
		 UserEntity userEntity = userRepository.findById(id)
	                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
	        return userDTOConverter.toDTO(userEntity);
		
	}
	@Override
	@Transactional
	public UserDTO updateUser(Integer id, CreateUserRequest request) {
	    UserEntity userEntity = userRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
	    userEntity.setFullName(request.getFullName());
	    userEntity.setPhone(request.getPhone());
	    userEntity.setEmail(request.getEmail());
	    if (request.getRole() != null && !request.getRole().isEmpty()) {
	        userEntity.setRole(UserRole.valueOf(request.getRole()));
	    }
	    if (request.getIsActive() != null) {
	        userEntity.setIsActive(request.getIsActive());
	    }
	    if (request.getPassword() != null && !request.getPassword().isEmpty()) {
	        userEntity.setPassword(passwordEncoder.encode(request.getPassword()));
	    }
	    if (UserRole.TEACHER.name().equals(userEntity.getRole().name())) {
	        TeacherEntity teacher = userEntity.getTeacher();
	        
	        if (teacher != null) {
	            teacher.setName(request.getFullName());
	            teacher.setEmail(request.getEmail());
	            teacher.setPhone(request.getPhone());

	            if (request.getBranchId() != null) {
	                BranchEntity branch = branchRepository.findById(request.getBranchId())
	                        .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
	                teacher.setBranch(branch);
	            }
	            teacherRepository.save(teacher);


	            if (request.getClassIds() != null) {

	                classTeacherRepository.deleteByTeacherEntity_Id(teacher.getId());
	                for (Integer classId : request.getClassIds()) {
	                    ClassEntity classEntity = classRepository.findById(classId)
	                            .orElseThrow(() -> new ResourceNotFoundException("Class not found: " + classId));
	                    
	                    ClassTeacherEntity ct = new ClassTeacherEntity();
	                    ct.setId(new ClassTeacherId(classId, teacher.getId()));
	                    ct.setClassEntity(classEntity);
	                    ct.setTeacherEntity(teacher);
	                    classTeacherRepository.save(ct);
	                }
	            }
	        }
	    }

	    UserEntity updatedUser = userRepository.save(userEntity);
	    return userDTOConverter.toDTO(updatedUser);
	}
	@Override
	public void resetPassword(Integer id, ResetPasswordRequest newPassword) {
		UserEntity userEntity = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
		userEntity.setPassword(passwordEncoder.encode(newPassword.getNewPassword()));
		userRepository.save(userEntity);
		
	}
	@Override
	public List<StudentDTO> getStudentsByParentId(Integer parentId) {
		userRepository.findById(parentId).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + parentId));
		List<StudentDTO> result = new ArrayList<>();
		List<StudentEntity> studentEntities = studentRepository.findByStudentParents_ParentUserId(parentId);
		for(StudentEntity x:studentEntities) {
			result.add(studentDTOConverter.toStudentDTO(x));
		}
		return result;
	}
	@Override
	@Transactional
	public void assignStudentsToParent(Integer parentId, List<Integer> studentIds) {
	    userRepository.findById(parentId).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + parentId));
	    studentParentRepository.deleteByParentUserId(parentId);
	    studentParentRepository.flush();
		for(Integer studentId:studentIds) {
			StudentEntity studentEntity = studentRepository.findById(studentId).orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
			StudentParentEntity studentParentEntity = new StudentParentEntity();
			studentParentEntity.setParentUserId(parentId);
			studentParentEntity.setStudentEntity(studentEntity);
			studentParentRepository.save(studentParentEntity);
		}
	}
	@Override
	@Transactional
	public void activateUser(Integer id) {
	    UserEntity user = userRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
	    user.setIsActive(true); 
	    userRepository.save(user);
	}

	@Override
	@Transactional
	public void deactivateUser(Integer id) {
	    UserEntity user = userRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
	    user.setIsActive(false); 
	    userRepository.save(user);
	}
}
