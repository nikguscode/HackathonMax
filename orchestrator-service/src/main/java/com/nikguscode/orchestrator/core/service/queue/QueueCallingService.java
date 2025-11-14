package com.nikguscode.orchestrator.core.service.queue;

import com.nikguscode.orchestrator.dao.queueentry.QueueEntryDao;
import com.nikguscode.orchestrator.dao.result.QueueEntryActiveRecord;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class QueueCallingService {
  private final QueueEntryDao queueEntryDao;

  public QueueCallingService(@Qualifier("queueEntryDao") QueueEntryDao queueEntryDao) {
    this.queueEntryDao = queueEntryDao;
  }


  @Transactional
  public void callUser(UUID queueEntryId) {
    List<QueueEntryActiveRecord> queues = queueEntryDao.findActiveByQueueId();
  }
}