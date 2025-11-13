package com.nikguscode.orchestrator.core.service.authentication;

import com.nikguscode.orchestrator.dto.max.MaxUserDataDto;
import com.nikguscode.orchestrator.core.service.user.MaxUserDataExtractor;
import com.nikguscode.orchestrator.core.service.user.UserService;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@Log4j2
public class MaxAuthenticationService implements AuthenticationService {
  private final UserService userService;
  private final MaxUserDataExtractor maxUserDataExtractor;

  public MaxAuthenticationService(
      UserService userService,
      MaxUserDataExtractor maxUserDataExtractor) {
    this.userService = userService;
    this.maxUserDataExtractor = maxUserDataExtractor;
  }

  @Override
  public MaxUserDataDto authenticate(UUID authId, String miniAppInitDataDto) {
    MaxUserDataDto maxUserDataDto = maxUserDataExtractor.extract(miniAppInitDataDto);

    log.info("UserDataDto:{}", maxUserDataDto);
    userService.getOrUpdateUserHashInformation(miniAppInitDataDto, authId, maxUserDataDto.getHash());

    return maxUserDataDto;
  }
}