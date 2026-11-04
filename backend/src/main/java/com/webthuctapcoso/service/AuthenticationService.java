package com.webthuctapcoso.service;

import com.webthuctapcoso.model.authentication.AuthenticationRequest;
import com.webthuctapcoso.model.authentication.AuthenticationResponse;
import com.webthuctapcoso.model.authentication.IntrospectRequest;
import com.webthuctapcoso.model.authentication.IntrospectResponse;
public interface AuthenticationService {
	AuthenticationResponse authenticate(AuthenticationRequest request);
	IntrospectResponse introspect(IntrospectRequest request);
}
