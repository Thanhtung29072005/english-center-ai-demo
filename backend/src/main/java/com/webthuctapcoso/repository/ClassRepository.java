package com.webthuctapcoso.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;
import com.webthuctapcoso.repository.entity.ClassEntity;

@Repository
public interface ClassRepository extends JpaRepository<ClassEntity, Integer> {

    List<ClassEntity> findByBranchEntityId(Integer branchId);
    List<ClassEntity> findByStudents_Id(Integer studentId);

}
