package com.webthuctapcoso.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.webthuctapcoso.repository.entity.BranchEntity;
@Repository
public interface BranchRepository extends JpaRepository<BranchEntity, Integer> {
	
}
