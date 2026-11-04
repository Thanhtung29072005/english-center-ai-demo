package com.webthuctapcoso.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.webthuctapcoso.model.CreateEnrollmentRequestDTO;
import com.webthuctapcoso.model.EnrollmentRequestDTO;
import com.webthuctapcoso.service.EnrollmentRequestService;

@RestController
@RequestMapping("/api")
public class EnrollmentRequestAPI {

    @Autowired
    private EnrollmentRequestService enrollmentRequestService;

    /**
     * PARENT API: Phụ huynh đã đăng nhập gửi form đăng ký học
     */
    @PostMapping("/parent/enrollment-requests")
    public ResponseEntity<EnrollmentRequestDTO> submitRequest(@RequestBody CreateEnrollmentRequestDTO dto) {
        EnrollmentRequestDTO result = enrollmentRequestService.submitRequest(dto);
        return ResponseEntity.ok(result);
    }

    /**
     * PARENT API: Lấy danh sách các đơn đăng ký của phụ huynh đang đăng nhập
     */
    @GetMapping("/parent/enrollment-requests")
    public ResponseEntity<List<EnrollmentRequestDTO>> getMyRequests(@RequestParam("username") String username) {
        List<EnrollmentRequestDTO> requests = enrollmentRequestService.getRequestsByUsername(username);
        return ResponseEntity.ok(requests);
    }

    /**
     * ADMIN API: Lấy danh sách các đơn đăng ký (Lọc theo PENDING, APPROVED,
     * REJECTED)
     */
    @GetMapping("/admin/enrollment-requests")
    public ResponseEntity<List<EnrollmentRequestDTO>> getRequests(
            @RequestParam(name = "status", required = false, defaultValue = "PENDING") String status) {
        List<EnrollmentRequestDTO> requests = enrollmentRequestService.getRequestsByStatus(status);
        return ResponseEntity.ok(requests);
    }

    /**
     * ADMIN API: Duyệt đơn đăng ký
     */
    @PostMapping("/admin/enrollment-requests/{id}/approve")
    public ResponseEntity<String> approveRequest(@PathVariable("id") Integer id) {
        try {
            enrollmentRequestService.approveRequest(id);
            return ResponseEntity.ok("Approved successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * ADMIN API: Từ chối đơn đăng ký
     */
    @PostMapping("/admin/enrollment-requests/{id}/reject")
    public ResponseEntity<String> rejectRequest(@PathVariable("id") Integer id) {
        try {
            enrollmentRequestService.rejectRequest(id);
            return ResponseEntity.ok("Rejected successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
