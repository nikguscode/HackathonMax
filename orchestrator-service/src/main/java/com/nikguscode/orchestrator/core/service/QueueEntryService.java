package com.nikguscode.orchestrator.core.service;

import com.nikguscode.openapi.model.QueueEntryResponseDto;
import com.nikguscode.orchestrator.dao.queueentry.QueueEntryDao;
import com.nikguscode.orchestrator.dao.result.QueueEntryRecord;
import com.nikguscode.orchestrator.core.mapper.QueueEntryDtoMapper;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

@Service
public class QueueEntryService {
  private final QueueEntryDao queueEntryDao;
  private final QueueEntryDtoMapper queueEntryDtoMapper;

  public QueueEntryService(
      @Qualifier("jooqQueueEntryDao") QueueEntryDao queueEntryDao,
      QueueEntryDtoMapper queueEntryDtoMapper) {
    this.queueEntryDao = queueEntryDao;
    this.queueEntryDtoMapper = queueEntryDtoMapper;
  }

  public QueueEntryResponseDto getQueueEntry(@PathVariable UUID entryId) {
    Optional<QueueEntryRecord> queueEntryOpt = queueEntryDao.findByEntryId(entryId);

    if (queueEntryOpt.isEmpty()) {
      return new QueueEntryResponseDto();
    }

    QueueEntryRecord queueEntryRecord = queueEntryOpt.get();
    return queueEntryDtoMapper.queueEntryToDto(queueEntryRecord);
  }
}