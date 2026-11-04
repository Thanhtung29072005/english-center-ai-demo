package com.webthuctapcoso.api;

import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;
import com.webthuctapcoso.model.RevenueReportDTO;
import com.webthuctapcoso.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportAPI {

    private static final String SIGNED_KEY = "617a07cfda6f7364591fd8641e8c398650dc2601732d9a120289d0a6e00361cd";

    @Autowired
    private ReportService reportService;

    @GetMapping("/revenue")
    public ResponseEntity<?> getRevenueReport(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Missing token");
        }

        String token = authHeader.substring(7);
        String role;
        String username;

        try {
            MACVerifier verifier = new MACVerifier(SIGNED_KEY.getBytes());
            SignedJWT signedJWT = SignedJWT.parse(token);
            if (!signedJWT.verify(verifier)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Invalid token");
            }
            role = String.valueOf(signedJWT.getJWTClaimsSet().getClaim("roles"));
            username = signedJWT.getJWTClaimsSet().getSubject();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Token parse error");
        }

        if (role == null || username == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Forbidden: No role in token");
        }

        String roleUpper = role.toUpperCase();

        if (roleUpper.equals("OWNER") || roleUpper.equals("ADMIN")) {
            // OWNER và ADMIN xem toàn bộ hệ thống
            RevenueReportDTO report = reportService.getRevenueReport();
            return ResponseEntity.ok(report);

        } else if (roleUpper.equals("BRANCH_MANAGER")) {
            // BRANCH_MANAGER chỉ xem chi nhánh của mình
            RevenueReportDTO report = reportService.getRevenueReportByManager(username);
            return ResponseEntity.ok(report);

        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Forbidden: You do not have permission to view revenue reports");
        }
    }
}

