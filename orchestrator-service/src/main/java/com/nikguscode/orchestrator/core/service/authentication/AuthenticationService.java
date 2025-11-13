package com.nikguscode.orchestrator.core.service.authentication;

import com.nikguscode.orchestrator.dto.MaxUserDataDto;
import java.util.UUID;

public interface AuthenticationService {
  MaxUserDataDto authenticate(UUID authId, String miniAppInitDataDto);
}