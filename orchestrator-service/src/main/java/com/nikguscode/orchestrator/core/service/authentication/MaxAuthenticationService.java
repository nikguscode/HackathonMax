package com.nikguscode.orchestrator.core.service.authentication;

import com.nikguscode.orchestrator.core.service.queue.QueueEntryService;
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
  private final QueueEntryService queueEntryService;
  private final MaxUserDataExtractor maxUserDataExtractor;

  public MaxAuthenticationService(
      UserService userService,
      QueueEntryService queueEntryService,
      MaxUserDataExtractor maxUserDataExtractor) {
    this.userService = userService;
    this.queueEntryService = queueEntryService;
    this.maxUserDataExtractor = maxUserDataExtractor;
  }

  @Override
  public MaxUserDataDto authenticate(UUID authId, String miniAppInitDataDto) {
    MaxUserDataDto maxUserDataDto = maxUserDataExtractor.extract(miniAppInitDataDto);

    log.info("UserDataDto:{}", maxUserDataDto);
    userService.getOrUpdateUserHashInformation(miniAppInitDataDto, authId,
        maxUserDataDto.getHash());

    if (maxUserDataDto.getStartParam() != null && maxUserDataDto.getUser() != null) {
      try {
        Long maxId = maxUserDataDto.getUser().getId();
        UUID queueId = UUID.fromString(maxUserDataDto.getStartParam());

        queueEntryService.createQueueEntry(queueId, maxId);
      } catch (IllegalArgumentException e) {
        log.info(
            "Значение: {} не может быть преобразовано в UUID", maxUserDataDto.getStartParam());
        throw new RuntimeException("Некорректное преобразование queueId");
      }
    }

    return maxUserDataDto;
  }
}