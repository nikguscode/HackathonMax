package com.nikguscode.orchestrator.service.authentication;

import com.nikguscode.orchestrator.dto.MaxUserDataDto;
import com.nikguscode.orchestrator.service.user.MaxUserDataExtractor;
import com.nikguscode.orchestrator.service.user.UserService;
import org.springframework.stereotype.Service;

@Service
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
    userService.getOrUpdateUserHashInformation(miniAppInitDataDto, maxId, maxUserDataDto.getHash());
  }
}