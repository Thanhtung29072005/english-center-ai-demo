package com.webthuctapcoso.service;

import com.webthuctapcoso.model.UserDTO;
import java.util.*;
import com.webthuctapcoso.model.CreateUserRequest;
import com.webthuctapcoso.model.ResetPasswordRequest;
import com.webthuctapcoso.model.StudentDTO;

public interface UserService {
	UserDTO createUser(CreateUserRequest request);
	List<UserDTO> findAll();
	void deleteUser(Integer id);
	UserDTO findById(Integer id);
	UserDTO updateUser(Integer id, CreateUserRequest request);
	void resetPassword(Integer id, ResetPasswordRequest newPassword);
	List<StudentDTO> getStudentsByParentId(Integer parentId);
	void assignStudentsToParent(Integer parentId, List<Integer> studentIds);
	void activateUser(Integer id);
	void deactivateUser(Integer id);
}
