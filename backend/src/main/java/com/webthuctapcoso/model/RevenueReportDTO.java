package com.webthuctapcoso.model;

import java.math.BigDecimal;
import java.util.List;

public class RevenueReportDTO {
    private BigDecimal totalRevenue;
    private List<BranchRevenueDTO> branchRevenues;

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public List<BranchRevenueDTO> getBranchRevenues() {
        return branchRevenues;
    }

    public void setBranchRevenues(List<BranchRevenueDTO> branchRevenues) {
        this.branchRevenues = branchRevenues;
    }
}
