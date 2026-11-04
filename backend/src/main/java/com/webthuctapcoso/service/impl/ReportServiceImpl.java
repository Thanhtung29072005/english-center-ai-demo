package com.webthuctapcoso.service.impl;

import com.webthuctapcoso.model.BranchRevenueDTO;
import com.webthuctapcoso.model.ClassRevenueDTO;
import com.webthuctapcoso.model.RevenueReportDTO;
import com.webthuctapcoso.repository.BranchRepository;
import com.webthuctapcoso.repository.ClassRepository;
import com.webthuctapcoso.repository.UserRepository;
import com.webthuctapcoso.repository.entity.BranchEntity;
import com.webthuctapcoso.repository.entity.ClassEntity;
import com.webthuctapcoso.repository.entity.UserEntity;
import com.webthuctapcoso.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReportServiceImpl implements ReportService {

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public RevenueReportDTO getRevenueReport() {
        RevenueReportDTO reportDTO = new RevenueReportDTO();
        BigDecimal totalRevenue = BigDecimal.ZERO;
        List<BranchRevenueDTO> branchRevenues = new ArrayList<>();

        List<BranchEntity> branches = branchRepository.findAll();

        for (BranchEntity branch : branches) {
            BranchRevenueDTO branchDTO = buildBranchRevenueDTO(branch);
            branchRevenues.add(branchDTO);
            totalRevenue = totalRevenue.add(branchDTO.getTotalRevenue());
        }

        reportDTO.setBranchRevenues(branchRevenues);
        reportDTO.setTotalRevenue(totalRevenue);

        return reportDTO;
    }

    @Override
    public RevenueReportDTO getRevenueReportByManager(String username) {
        RevenueReportDTO reportDTO = new RevenueReportDTO();
        List<BranchRevenueDTO> branchRevenues = new ArrayList<>();

        Optional<UserEntity> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            UserEntity user = userOpt.get();
            BranchEntity branch = user.getBranch();
            if (branch != null) {
                // Reload branch đầy đủ để lấy classes
                Optional<BranchEntity> fullBranch = branchRepository.findById(branch.getId());
                if (fullBranch.isPresent()) {
                    BranchRevenueDTO branchDTO = buildBranchRevenueDTO(fullBranch.get());
                    branchRevenues.add(branchDTO);
                    reportDTO.setTotalRevenue(branchDTO.getTotalRevenue());
                } else {
                    reportDTO.setTotalRevenue(BigDecimal.ZERO);
                }
            } else {
                reportDTO.setTotalRevenue(BigDecimal.ZERO);
            }
        } else {
            reportDTO.setTotalRevenue(BigDecimal.ZERO);
        }

        reportDTO.setBranchRevenues(branchRevenues);
        return reportDTO;
    }

    /**
     * Tính toán doanh thu cho một chi nhánh dựa trên số học sinh và học phí từng lớp.
     */
    private BranchRevenueDTO buildBranchRevenueDTO(BranchEntity branch) {
        BranchRevenueDTO branchDTO = new BranchRevenueDTO();
        branchDTO.setBranchId(branch.getId());
        branchDTO.setBranchName(branch.getName());

        BigDecimal branchTotal = BigDecimal.ZERO;
        List<ClassRevenueDTO> classRevenues = new ArrayList<>();

        List<ClassEntity> classes = branch.getClasses();
        if (classes != null) {
            for (ClassEntity cls : classes) {
                ClassRevenueDTO classDTO = new ClassRevenueDTO();
                classDTO.setClassId(cls.getId());
                classDTO.setClassName(cls.getName());
                classDTO.setLevel(cls.getLevel());

                BigDecimal price = cls.getPrice() != null ? cls.getPrice() : BigDecimal.ZERO;
                classDTO.setPrice(price);

                int studentCount = cls.getStudents() != null ? cls.getStudents().size() : 0;
                classDTO.setStudentCount(studentCount);

                BigDecimal classTotal = price.multiply(BigDecimal.valueOf(studentCount));
                classDTO.setTotalRevenue(classTotal);

                classRevenues.add(classDTO);
                branchTotal = branchTotal.add(classTotal);
            }
        }

        branchDTO.setClassRevenues(classRevenues);
        branchDTO.setTotalRevenue(branchTotal);
        return branchDTO;
    }
}
