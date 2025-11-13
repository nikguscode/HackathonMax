package com.nikguscode.orchestrator.core.service.authentication;

public interface AuthenticationService {
  void authenticate(String miniAppInitDataDto, Long maxId);
}