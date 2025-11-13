package com.nikguscode.orchestrator.core.service.authentication;

import com.nikguscode.orchestrator.dto.max.MaxUserDataDto;
import java.util.UUID;

public interface AuthenticationService {
  MaxUserDataDto authenticate(UUID authId, String miniAppInitDataDto);
}