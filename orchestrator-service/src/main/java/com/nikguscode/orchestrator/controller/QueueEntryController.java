package com.nikguscode.orchestrator.controller;

import com.nikguscode.openapi.model.QueueEntryResponseDto;
import com.nikguscode.openapi.model.QueueEntryStatusUpdateRequestDto;
import com.nikguscode.orchestrator.core.service.queue.QueueEntryService;
import com.nikguscode.orchestrator.dao.queueentry.QueueEntryDao;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

  @PutMapping("/{entryId}")
  public ResponseEntity<Void> updateQueueEntryStatus(
      @PathVariable UUID entryId, @RequestBody QueueEntryStatusUpdateRequestDto dto) {
    queueEntryService.updateQueueEntryStatus(entryId, dto);
    return ResponseEntity.status(HttpStatus.OK).build();
  }

  @GetMapping("/{entryId}")
  public QueueEntryResponseDto getQueueEntry(@PathVariable UUID entryId) {
    return queueEntryService.getQueueEntry(entryId);
  }

  @DeleteMapping("/{entryId}")
  public ResponseEntity<Void> deleteQueueEntry(@PathVariable UUID entryId) {
    queueEntryDao.delete(entryId);
    return ResponseEntity.status(HttpStatus.OK).build();
  }
}