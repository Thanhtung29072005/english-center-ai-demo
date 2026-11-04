package com.webthuctapcoso.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.webthuctapcoso.converter.TeacherDTOConverter;
import com.webthuctapcoso.exception.ResourceNotFoundException;
import com.webthuctapcoso.model.CreateTeacherRequestDTO;
import com.webthuctapcoso.model.TeacherDTO;
import com.webthuctapcoso.model.UpdateTeacherRequestDTO;
import com.webthuctapcoso.repository.BranchRepository;
import com.webthuctapcoso.repository.TeacherRepository;
import com.webthuctapcoso.repository.entity.BranchEntity;
import com.webthuctapcoso.repository.entity.TeacherEntity;
import com.webthuctapcoso.service.TeacherService;
import java.util.*;
@Service
public class TeacherServiceImpl implements TeacherService {
	@Autowired 
	private BranchRepository branchRepository;
	@Autowired
	private TeacherRepository teacherRepository;
	@Autowired
	private TeacherDTOConverter teacherDTOConverter;
	@Override
	public List<TeacherDTO> findAll() {
		List<TeacherDTO> result=new ArrayList<>();
		List<TeacherEntity> teacherEntities =teacherRepository.findAll();
		for(TeacherEntity x:teacherEntities) {
			result.add(teacherDTOConverter.toTeacherDTO(x));
		}
		return result;
	}

	@Override
	public List<TeacherDTO> findByBranchId(Integer branchId) {
		BranchEntity branchEntity =branchRepository.findById(branchId).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
		List<TeacherDTO> result=new ArrayList<>();
		for(TeacherEntity x:teacherRepository.findByBranch_Id(branchId)) {
			result.add(teacherDTOConverter.toTeacherDTO(x));
		}
		return result;
	}

	@Override
	public TeacherDTO findById(Integer id) {
		TeacherEntity teacherEntity = teacherRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
		return teacherDTOConverter.toTeacherDTO(teacherEntity);
	}

	@Override
	public TeacherDTO createTeacher(CreateTeacherRequestDTO request) {
		BranchEntity branch =branchRepository.findById(request.getBranchId()).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
		if(teacherRepository.existsByEmail(request.getEmail())) {
			throw new IllegalArgumentException("Email already exists");
		}
		TeacherEntity teacherEntity = new TeacherEntity();
		teacherEntity.setName(request.getName());
		teacherEntity.setEmail(request.getEmail());
		teacherEntity.setPhone(request.getPhone());
		teacherEntity.setBranch(branch);
		TeacherEntity saved =teacherRepository.save(teacherEntity);
		return teacherDTOConverter.toTeacherDTO(saved);
	}

	@Override
	public TeacherDTO updateTeacher(Integer id, UpdateTeacherRequestDTO request) {

	    TeacherEntity teacherEntity = teacherRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

	    if(request.getName() != null){
	        teacherEntity.setName(request.getName());
	    }

	    if(request.getEmail() != null){
	        if(teacherRepository.existsByEmail(request.getEmail())
	                && !teacherEntity.getEmail().equals(request.getEmail())){
	            throw new IllegalArgumentException("Email already exists");
	        }
	        teacherEntity.setEmail(request.getEmail());
	    }

	    if(request.getPhone() != null){
	        teacherEntity.setPhone(request.getPhone());
	    }

	    if(request.getBranchId() != null){
	        BranchEntity branch = branchRepository.findById(request.getBranchId())
	                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
	        teacherEntity.setBranch(branch);
	    }

	    TeacherEntity updated = teacherRepository.save(teacherEntity);

	    return teacherDTOConverter.toTeacherDTO(updated);
	}

	@Override
	public void deleteTeacher(Integer id) {
		TeacherEntity teacherEntity = teacherRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
		teacherRepository.delete(teacherEntity);
		
	}
	
}
