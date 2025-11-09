package com.nikguscode.orchestrator.controller;

import com.nikguscode.orchestrator.dao.queueentry.QueueEntryDao;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/queue-entries")
public class QueueEntryController {
  private final QueueEntryDao queueEntryDao;

  public QueueEntryController(@Qualifier("jooqQueueEntryDao") QueueEntryDao queueEntryDao) {
    this.queueEntryDao = queueEntryDao;
  }

  @DeleteMapping("/{entryId}")
  public String deleteQueueEntry(@PathVariable UUID entryId) {
    queueEntryDao.delete(entryId);
    return "zaglushka";
  }
}