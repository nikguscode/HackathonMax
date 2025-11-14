package com.nikguscode.orchestrator.core.service.queue;

import com.nikguscode.openapi.model.QueueEntryResponseDto;
import com.nikguscode.openapi.model.QueueEntryStatusUpdateRequestDto;
import com.nikguscode.orchestrator.core.enums.enums.QueueEntryStatus;
import com.nikguscode.orchestrator.core.mapper.QueueEntryDtoMapper;
import com.nikguscode.orchestrator.dao.queueentry.QueueEntryDao;
import com.nikguscode.orchestrator.dao.result.QueueEntryRecord;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class QueueEntryService {
  private final QueueEntryDao queueEntryDao;
  private final QueueCallingService queueCallingService;
  private final QueueEntryDtoMapper queueEntryDtoMapper;

  public QueueEntryService(
      @Qualifier("jooqQueueEntryDao") QueueEntryDao queueEntryDao,
      QueueCallingService queueCallingService,
      QueueEntryDtoMapper queueEntryDtoMapper) {
    this.queueEntryDao = queueEntryDao;
    this.queueCallingService = queueCallingService;
    this.queueEntryDtoMapper = queueEntryDtoMapper;
  }

  // WAITING
  // CALLED -> в мету добавляем join_at
  // SERVING -> в мету добавляем
  // SERVED
  // CANCELED ->
  // MISSING -> вызов следующего
  public void updateQueueEntryStatus(UUID entryId, QueueEntryStatusUpdateRequestDto dto) {
    queueEntryDao.updateByEntryId(entryId, queueEntryDtoMapper.toEnum(dto.getStatus()));

  }

  public QueueEntryResponseDto getQueueEntry(UUID entryId) {
    Optional<QueueEntryRecord> queueEntryOpt = queueEntryDao.findByEntryId(entryId);

    if (queueEntryOpt.isEmpty()) {
      return new QueueEntryResponseDto();
    }

    QueueEntryRecord queueEntryRecord = queueEntryOpt.get();
    return queueEntryDtoMapper.entryToDto(queueEntryRecord);
  }
}