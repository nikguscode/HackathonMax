package com.nikguscode.orchestrator.service;

import com.nikguscode.openapi.model.QueueEntryResponseDto;
import com.nikguscode.orchestrator.dao.queueentry.QueueEntryDao;
import com.nikguscode.orchestrator.dao.result.QueueEntryActiveRecord;
import com.nikguscode.orchestrator.mapper.QueueEntryDtoMapper;
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
    Optional<QueueEntryActiveRecord> queueEntryOpt = queueEntryDao.findByEntryId(entryId);

    if (queueEntryOpt.isEmpty()) {
      return new QueueEntryResponseDto();
    }

    QueueEntryActiveRecord queueEntryActiveRecord = queueEntryOpt.get();
    return queueEntryDtoMapper.queueEntryToDto(queueEntryActiveRecord);
  }
}