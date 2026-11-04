package com.webthuctapcoso.service.impl;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jose.*;
import com.nimbusds.jwt.*;
import com.webthuctapcoso.exception.ResourceNotFoundException;
import com.webthuctapcoso.model.authentication.AuthenticationRequest;
import com.webthuctapcoso.model.authentication.AuthenticationResponse;
import com.webthuctapcoso.repository.UserRepository;
import com.webthuctapcoso.repository.entity.UserEntity;
import com.webthuctapcoso.service.AuthenticationService;
import com.webthuctapcoso.model.authentication.IntrospectRequest;
import com.webthuctapcoso.model.authentication.IntrospectResponse;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {
	protected static final String SIGNED_KEY = "617a07cfda6f7364591fd8641e8c398650dc2601732d9a120289d0a6e00361cd";
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	public IntrospectResponse introspect(IntrospectRequest request) {
		IntrospectResponse response = new IntrospectResponse();
		String token = request.getToken();
		boolean verified = false;
		try {
			JWSVerifier verifier = new MACVerifier(SIGNED_KEY.getBytes());
			SignedJWT signedJWT = SignedJWT.parse(token);
			Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
			verified = (signedJWT.verify(verifier)) && (expirationTime != null && expirationTime.after(new Date()));
		} catch (JOSEException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}catch (java.text.ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		response.setValid(verified);
		return response;
	}
	@Override
	public AuthenticationResponse authenticate(AuthenticationRequest request) {
		UserEntity user = userRepository.findByUsername(request.getUsername())
			    .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + request.getUsername()));
		boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
		if (!authenticated) {
			AuthenticationResponse response = new AuthenticationResponse();
			response.setAuthenticated(false);
			return response;
		} else {
			String token = generateToken(user);
			AuthenticationResponse response = new AuthenticationResponse();
			response.setAuthenticated(true);
			response.setToken(token);
			return response;
		}
	}
	private String generateToken(UserEntity user) {
		JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
		JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
			    .subject(user.getUsername())
			    .issuer("webQLDT.com")
			    .issueTime(new java.util.Date())
			    .expirationTime(new java.util.Date(System.currentTimeMillis() + 3600000)) // Token expires in 1 hour
			    .claim("roles", user.getRole())
			    .build();
		Payload payload = new Payload(claimsSet.toJSONObject());
		JWSObject jwsObject = new JWSObject(header, payload);
		try {
			jwsObject.sign(new MACSigner(SIGNED_KEY.getBytes()));
		} catch (KeyLengthException e) {
			e.printStackTrace();
		} catch (JOSEException e) {
			e.printStackTrace();
		}
		return jwsObject.serialize();
	}
}
