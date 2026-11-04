package com.webthuctapcoso.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.webthuctapcoso.model.authentication.AuthenticationRequest;
import com.webthuctapcoso.model.authentication.AuthenticationResponse;
import com.webthuctapcoso.service.AuthenticationService;
import com.webthuctapcoso.model.authentication.IntrospectRequest;
import com.webthuctapcoso.model.authentication.IntrospectResponse;
@RestController
@RequestMapping("/api/Auth")
@CrossOrigin(origins = "http://localhost:5174")
public class AuthenticationAPI {
	@Autowired
	private AuthenticationService authenticationService;
	@PostMapping("/login")
	public AuthenticationResponse login(@RequestBody AuthenticationRequest request) {
		AuthenticationResponse response = authenticationService.authenticate(request);
		return response;
	}
	@PostMapping("/introspect")
	public IntrospectResponse introspect(@RequestBody IntrospectRequest request) {
		IntrospectResponse response = authenticationService.introspect(request);
		return response;
	}
}
