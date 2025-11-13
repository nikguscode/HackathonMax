package com.nikguscode.orchestrator.service.authentication;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class MaxAuthenticationService implements AuthenticationService {
  private final String maxBotToken;
  private final MaxHashVerifyService maxHashVerifyService;

  public MaxAuthenticationService(
      @Value("${max.bot.token}") String maxBotToken,
      MaxHashVerifyService maxHashVerifyService) {
    this.maxBotToken = maxBotToken;
    this.maxHashVerifyService = maxHashVerifyService;
  }

  // 1. Проверка, есть ли юзер в кэше
  // 2. Если юзера нет в кеше, проверка, есть ли в БД
  // 3. Если есть в БД, извлекаем => добавляем в кэш
  // 4. Если нет в БД, добавляем в БД, затем в кэщ
  @Override
  public void authenticate(String miniAppInitDataDto) {
    if (maxHashVerifyService.check(miniAppInitDataDto, maxBotToken)) {

    }
  }
}