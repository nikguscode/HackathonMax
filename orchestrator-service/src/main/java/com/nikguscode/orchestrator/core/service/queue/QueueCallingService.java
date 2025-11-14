package com.nikguscode.orchestrator.core.service.queue;

import com.nikguscode.orchestrator.dao.tables.queueentry.QueueEntryDao;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class QueueCallingService {
  private final QueueEntryDao queueEntryDao;

  public QueueCallingService(@Qualifier("jooqQueueEntryDao") QueueEntryDao queueEntryDao) {
    this.queueEntryDao = queueEntryDao;
  }

//
//  @Transactional
//  public void callUser(UUID queueEntryId) {
//    List<QueueEntryActiveRecord> queues = queueEntryDao.findActiveByQueueId();
//  }
}