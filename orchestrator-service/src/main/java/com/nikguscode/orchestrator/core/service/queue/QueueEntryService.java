package com.nikguscode.orchestrator.core.service.queue;

import com.nikguscode.openapi.model.QueueEntryCreatingRequestDto;
import com.nikguscode.openapi.model.QueueEntryResponseDto;
import com.nikguscode.openapi.model.QueueEntryStatusUpdateRequestDto;
import com.nikguscode.orchestrator.core.enums.enums.QueueEntryStatus;
import com.nikguscode.orchestrator.core.mapper.QueueEntryDtoMapper;
import com.nikguscode.orchestrator.core.model.QueueEntry;
import com.nikguscode.orchestrator.core.model.QueueEntryMeta;
import com.nikguscode.orchestrator.dao.result.QueueEntryActiveRecord;
import com.nikguscode.orchestrator.dao.result.QueueEntryRecord;
import com.nikguscode.orchestrator.dao.tables.queueentry.QueueEntryDao;
import com.nikguscode.orchestrator.dao.tables.userroles.UserRolesDao;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Log4j2
public class QueueEntryService {
  private final QueueEntryDao queueEntryDao;
  private final UserRolesDao userRolesDao;
  private final QueueCallingService queueCallingService;
  private final QueueEntryDtoMapper queueEntryDtoMapper;

  public QueueEntryService(
      @Qualifier("jooqQueueEntryDao") QueueEntryDao queueEntryDao,
      @Qualifier("jooqUserRolesDao") UserRolesDao userRolesDao,
      QueueCallingService queueCallingService,
      QueueEntryDtoMapper queueEntryDtoMapper) {
    this.queueEntryDao = queueEntryDao;
    this.userRolesDao = userRolesDao;
    this.queueCallingService = queueCallingService;
    this.queueEntryDtoMapper = queueEntryDtoMapper;
  }

  // (даётся при создании) WAITING -> в мету добавляем joined_at

  // queue id
  // max id
  // 1. создать queue entry
  // 2. создать queue entry meta
  // 3. создать user roles
  @Transactional
  public void createQueueEntry(UUID queueId, Long maxId) {
    final UUID queueEntryId = UUID.randomUUID();
    QueueEntry queueEntry = QueueEntry.builder()
        .id(queueEntryId)
        .queueId(queueId)
        .maxId(maxId)
        .status(QueueEntryStatus.WAITING)
        .build();
    System.out.println(queueEntry);

    QueueEntryMeta queueEntryMeta = QueueEntryMeta.builder()
        .queueEntryId(queueEntryId)
        .build();

    System.out.println(queueEntryMeta);

    queueEntryDao.create(queueEntry, queueEntryMeta);

    userRolesDao.insertRoleByQueueId(maxId, queueId);
  }

  public void createQueueEntry(QueueEntryCreatingRequestDto dto) {

  }

  // CALLED -> в мету добавляем called_at
  // SERVING -> в мету добавляем arrived_at, started_at
  // SERVED -> в мету добавляем finished_at
  // CANCELED
  // MISSING -> в мету добавляем missed_at
  public void updateQueueEntryStatus(UUID entryId, QueueEntryStatusUpdateRequestDto dto) {
    queueEntryDao.updateByEntryId(entryId, queueEntryDtoMapper.toEnum(dto.getStatus()));
//    List<QueueEntryActiveRecord> activeQueuesRecord
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