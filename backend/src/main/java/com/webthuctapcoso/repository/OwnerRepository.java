package com.webthuctapcoso.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.webthuctapcoso.repository.entity.OwnerEntity;
@Repository
public interface OwnerRepository extends JpaRepository<OwnerEntity, Integer> {
	
}
