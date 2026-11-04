package com.webthuctapcoso.model;

import java.math.BigDecimal;
import java.util.List;

public class BranchRevenueDTO {
    private Integer branchId;
    private String branchName;
    private BigDecimal totalRevenue;
    private List<ClassRevenueDTO> classRevenues;

    public Integer getBranchId() {
        return branchId;
    }

    public void setBranchId(Integer branchId) {
        this.branchId = branchId;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public List<ClassRevenueDTO> getClassRevenues() {
        return classRevenues;
    }

    public void setClassRevenues(List<ClassRevenueDTO> classRevenues) {
        this.classRevenues = classRevenues;
    }
}
