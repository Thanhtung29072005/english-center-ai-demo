package com.webthuctapcoso.service;

import com.webthuctapcoso.model.RevenueReportDTO;

public interface ReportService {
    RevenueReportDTO getRevenueReport();
    RevenueReportDTO getRevenueReportByManager(String username);
}
