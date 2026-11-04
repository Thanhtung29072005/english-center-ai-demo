package com.webthuctapcoso.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.webthuctapcoso.model.CreateEnrollmentRequestDTO;
import com.webthuctapcoso.model.EnrollmentRequestDTO;
import com.webthuctapcoso.repository.BranchRepository;
import com.webthuctapcoso.repository.ClassRepository;
import com.webthuctapcoso.repository.EnrollmentRequestRepository;
import com.webthuctapcoso.repository.StudentParentRepository;
import com.webthuctapcoso.repository.StudentRepository;
import com.webthuctapcoso.repository.UserRepository;
import com.webthuctapcoso.repository.entity.BranchEntity;
import com.webthuctapcoso.repository.entity.ClassEntity;
import com.webthuctapcoso.repository.entity.EnrollmentRequestEntity;
import com.webthuctapcoso.repository.entity.StudentEntity;
import com.webthuctapcoso.repository.entity.StudentParentEntity;
import com.webthuctapcoso.repository.entity.UserEntity;
import com.webthuctapcoso.repository.eNum.UserRole;
import com.webthuctapcoso.service.EnrollmentRequestService;

@Service
public class EnrollmentRequestServiceImpl implements EnrollmentRequestService {

    @Autowired
    private EnrollmentRequestRepository enrollmentRequestRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentParentRepository studentParentRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public EnrollmentRequestDTO submitRequest(CreateEnrollmentRequestDTO dto) {
        // Tìm User theo username để lấy ID
        UserEntity parentUser = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("Tài khoản phụ huynh không tồn tại!"));

        ClassEntity classEntity = classRepository.findById(dto.getClassId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));

        BranchEntity branchEntity = branchRepository.findById(dto.getBranchId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi nhánh"));

        EnrollmentRequestEntity entity = modelMapper.map(dto, EnrollmentRequestEntity.class);
        entity.setClassEntity(classEntity);
        entity.setBranchEntity(branchEntity);
        entity.setParentUserId(parentUser.getId());

        // prePersist sẽ tự set status là PENDING và createdAt
        entity = enrollmentRequestRepository.save(entity);

        return mapToDTO(entity);
    }

    @Override
    public List<EnrollmentRequestDTO> getRequestsByStatus(String status) {
        List<EnrollmentRequestEntity> entities;
        if (status == null || status.isEmpty() || status.equalsIgnoreCase("ALL")) {
            entities = enrollmentRequestRepository.findAll();
        } else {
            entities = enrollmentRequestRepository.findByStatus(status);
        }

        return entities.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void approveRequest(Integer requestId) {
        EnrollmentRequestEntity request = enrollmentRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đăng ký"));

        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException("Đơn đăng ký không ở trạng thái PENDING");
        }

        UserEntity parentUser = userRepository.findById(request.getParentUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản phụ huynh"));

        // 1. Tạo học viên mới
        StudentEntity student = new StudentEntity();
        student.setClassEntity(request.getClassEntity());
        student.setName(request.getStudentName());
        student.setDateOfBirth(request.getDateOfBirth());
        // Lấy thông tin liên hệ từ tài khoản User của phụ huynh
        student.setParentName(parentUser.getFullName());
        student.setParentPhone(parentUser.getPhone());
        student.setParentEmail(parentUser.getEmail());

        // Lưu học viên
        student = studentRepository.save(student);

        // 2. Liên kết phụ huynh với học sinh
        StudentParentEntity studentParent = new StudentParentEntity();
        studentParent.setStudentEntity(student);
        studentParent.setParentUserId(parentUser.getId());
        studentParentRepository.save(studentParent);

        // 3. Tạo tài khoản đăng nhập cho học sinh
        UserEntity studentUser = new UserEntity();
        studentUser.setUsername("hs_" + student.getId());
        studentUser.setPassword(passwordEncoder.encode("123456"));
        studentUser.setFullName(student.getName());
        studentUser.setEmail(null);
        studentUser.setPhone(null);
        studentUser.setRole(UserRole.STUDENT);
        studentUser.setIsActive(true);
        studentUser.setStudent(student);
        userRepository.save(studentUser);

        // 4. Đổi trạng thái request thành đã duyệt
        request.setStatus("APPROVED");
        enrollmentRequestRepository.save(request);
    }

    @Override
    @Transactional
    public void rejectRequest(Integer requestId) {
        EnrollmentRequestEntity request = enrollmentRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đăng ký"));

        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException("Đơn đăng ký không ở trạng thái PENDING");
        }

        request.setStatus("REJECTED");
        enrollmentRequestRepository.save(request);
    }

    @Override
    public List<EnrollmentRequestDTO> getRequestsByUsername(String username) {
        UserEntity parentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản phụ huynh"));

        List<EnrollmentRequestEntity> entities = enrollmentRequestRepository.findByParentUserId(parentUser.getId());
        return entities.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private EnrollmentRequestDTO mapToDTO(EnrollmentRequestEntity entity) {
        EnrollmentRequestDTO dto = modelMapper.map(entity, EnrollmentRequestDTO.class);
        if (entity.getClassEntity() != null) {
            dto.setClassId(entity.getClassEntity().getId());
            dto.setClassName(entity.getClassEntity().getName());
            dto.setClassPrice(entity.getClassEntity().getPrice());
        }
        if (entity.getBranchEntity() != null) {
            dto.setBranchId(entity.getBranchEntity().getId());
            dto.setBranchName(entity.getBranchEntity().getName());
        }

        // Lấy thêm thông tin User để Admin dễ xem trên bảng
        if (entity.getParentUserId() != null) {
            userRepository.findById(entity.getParentUserId()).ifPresent(user -> {
                dto.setParentName(user.getFullName());
                dto.setParentPhone(user.getPhone());
            });
        }

        if ("APPROVED".equals(entity.getStatus()) && entity.getClassEntity() != null && entity.getParentUserId() != null) {
            List<StudentEntity> matchedStudents = studentRepository.findByClassEntity_IdAndNameAndDateOfBirth(
                    entity.getClassEntity().getId(), entity.getStudentName(), entity.getDateOfBirth());
            for (StudentEntity student : matchedStudents) {
                boolean linkedToParent = studentParentRepository.existsByStudentEntity_IdAndParentUserId(
                        student.getId(), entity.getParentUserId());
                if (linkedToParent) {
                    userRepository.findByStudent_Id(student.getId()).ifPresent(studentUser -> dto.setStudentUsername(studentUser.getUsername()));
                    break;
                }
            }
        }

        return dto;
    }
}
