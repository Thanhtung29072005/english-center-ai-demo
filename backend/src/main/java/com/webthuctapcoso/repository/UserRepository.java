package com.webthuctapcoso.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.webthuctapcoso.repository.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
	Optional<UserEntity> findByEmail(String email); 
    Optional<UserEntity> findByUsername(String username); 
    Boolean existsByUsername(String username); 
    Boolean existsByEmail(String email);
    boolean existsById(Integer id);
    Optional<UserEntity> findByStudent_Id(Integer studentId);
}
