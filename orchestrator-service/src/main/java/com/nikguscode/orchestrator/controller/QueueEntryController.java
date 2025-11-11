package com.nikguscode.orchestrator.controller;

import com.nikguscode.orchestrator.dao.queueentry.QueueEntryDao;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("v1/api/queue-entries")
public class QueueEntryController {
  private final QueueEntryDao queueEntryDao;

  public QueueEntryController(@Qualifier("jooqQueueEntryDao") QueueEntryDao queueEntryDao) {
    this.queueEntryDao = queueEntryDao;
  }

//  @GetMapping("/{entryId}")
//  public QueueEntryResponseDto getQueueEntry(@PathVariable UUID entryId) {
//    return queueEntryDao.findByEntryId(entryId);
//  }

  @DeleteMapping("/{entryId}")
  public void deleteQueueEntry(@PathVariable UUID entryId) {
    queueEntryDao.delete(entryId);
  }
}