package com.nikguscode.orchestrator.core.service.authentication;

import com.nikguscode.orchestrator.dto.MaxUserDataDto;
import com.nikguscode.orchestrator.core.service.user.MaxUserDataExtractor;
import com.nikguscode.orchestrator.core.service.user.UserService;
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

  // 1. Проверка, есть ли юзер в кэше
  // 2. Если юзера нет в кеше, проверка, есть ли в БД
  // 3. Если есть в БД, извлекаем => добавляем в кэш
  // 4. Если нет в БД, добавляем в БД, затем в кэщ
  @Override
  public void authenticate(String miniAppInitDataDto, Long maxId) {
    MaxUserDataDto maxUserDataDto = maxUserDataExtractor.extract(miniAppInitDataDto);

    log.info("UserDataDto:{}", maxUserDataDto);
    userService.getOrUpdateUserHashInformation(miniAppInitDataDto, maxId, maxUserDataDto.getHash());
  }
}