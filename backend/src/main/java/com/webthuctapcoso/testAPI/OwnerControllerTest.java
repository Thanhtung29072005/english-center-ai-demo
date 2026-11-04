package com.webthuctapcoso.testAPI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;
import com.webthuctapcoso.repository.entity.OwnerEntity;
import com.webthuctapcoso.repository.OwnerRepository;

@RestController
public class OwnerControllerTest {
	@Autowired
	private OwnerRepository ownerRepository;
	@GetMapping("/test")
	public List<OwnerEntity> test() {
		return ownerRepository.findAll();
	}
}
