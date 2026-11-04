package com.webthuctapcoso.service;

import java.util.List;

import com.webthuctapcoso.model.CreateEnrollmentRequestDTO;
import com.webthuctapcoso.model.EnrollmentRequestDTO;

public interface EnrollmentRequestService {
    EnrollmentRequestDTO submitRequest(CreateEnrollmentRequestDTO dto);
    
    List<EnrollmentRequestDTO> getRequestsByStatus(String status);
    
    List<EnrollmentRequestDTO> getRequestsByUsername(String username);
    
    void approveRequest(Integer requestId);
    
    void rejectRequest(Integer requestId);
}
