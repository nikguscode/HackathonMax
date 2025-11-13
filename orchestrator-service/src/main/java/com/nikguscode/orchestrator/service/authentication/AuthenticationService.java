package com.nikguscode.orchestrator.service.authentication;

public interface AuthenticationService {
  void authenticate(String miniAppInitDataDto, Long maxId);
}