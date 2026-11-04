package com.webthuctapcoso.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
import com.webthuctapcoso.repository.entity.TeacherEntity;

public interface TeacherRepository extends JpaRepository<TeacherEntity, Integer>{
	List<TeacherEntity> findByBranch_Id(Integer branchId);

	boolean existsByEmail(String email);
}
