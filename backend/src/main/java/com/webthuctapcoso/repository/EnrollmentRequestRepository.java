package com.webthuctapcoso.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.webthuctapcoso.repository.entity.EnrollmentRequestEntity;
import java.util.List;

@Repository
public interface EnrollmentRequestRepository extends JpaRepository<EnrollmentRequestEntity, Integer> {
    
    // Lấy danh sách các đơn đăng ký theo trạng thái (ví dụ: 'PENDING')
    List<EnrollmentRequestEntity> findByStatus(String status);
    
    // Lấy danh sách đăng ký của 1 phụ huynh
    List<EnrollmentRequestEntity> findByParentUserId(Integer parentUserId);
    
}
