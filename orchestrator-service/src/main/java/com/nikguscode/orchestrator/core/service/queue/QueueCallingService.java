package com.nikguscode.orchestrator.core.service.queue;

import com.nikguscode.jooq.enums.QueueEntryStatus;
import com.nikguscode.orchestrator.dao.result.QueueEntryCalledStatusRecord;
import com.nikguscode.orchestrator.dao.tables.queueentry.QueueEntryDao;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class QueueCallingService {
  private final QueueEntryDao queueEntryDao;

  public QueueCallingService(@Qualifier("jooqQueueEntryDao") QueueEntryDao queueEntryDao) {
    this.queueEntryDao = queueEntryDao;
  }

  @Scheduled(fixedDelay = 10000)
  public void callUser() {
    List<QueueEntryCalledStatusRecord> calledUsers = queueEntryDao.get();

    List<QueueEntryCalledStatusRecord> excludedUsers = calledUsers.stream()
        .filter(
            en -> en.getJoinedAt()
                .plusMinutes(en.getQueueArrivalGracePeriod())
                .isAfter(LocalDateTime.now()))
        .toList();

    System.out.println(excludedUsers);

    excludedUsers.forEach(
        e -> queueEntryDao.updateByEntryId(e.getId(), QueueEntryStatus.MISSED));
  }
}