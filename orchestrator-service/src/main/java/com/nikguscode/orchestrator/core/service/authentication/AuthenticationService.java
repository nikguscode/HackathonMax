package com.nikguscode.orchestrator.core.service.authentication;

import com.nikguscode.orchestrator.dto.MaxUserDataDto;

public interface AuthenticationService {
  MaxUserDataDto authenticate(String miniAppInitDataDto, Long maxId);
}