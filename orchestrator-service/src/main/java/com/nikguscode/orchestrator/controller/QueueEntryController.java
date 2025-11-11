package com.nikguscode.orchestrator.controller;

import com.nikguscode.openapi.model.QueueEntryResponseDto;
import com.nikguscode.orchestrator.dao.queueentry.QueueEntryDao;
import com.nikguscode.orchestrator.service.QueueEntryService;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("v1/api/queue-entries")
public class QueueEntryController {
  private final QueueEntryDao queueEntryDao;
  private final QueueEntryService queueEntryService;

  public QueueEntryController(
      @Qualifier("jooqQueueEntryDao") QueueEntryDao queueEntryDao,
      QueueEntryService queueEntryService) {
    this.queueEntryDao = queueEntryDao;
    this.queueEntryService = queueEntryService;
  }

  @GetMapping("/{entryId}")
  public QueueEntryResponseDto getQueueEntry(@PathVariable UUID entryId) {
    return queueEntryService.getQueueEntry(entryId);
  }

  @DeleteMapping("/{entryId}")
  public void deleteQueueEntry(@PathVariable UUID entryId) {
    queueEntryDao.delete(entryId);
  }
}