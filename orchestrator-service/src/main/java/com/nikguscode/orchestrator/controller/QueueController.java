package com.nikguscode.orchestrator.controller;

import com.nikguscode.openapi.model.QueueResponseDto;
import com.nikguscode.orchestrator.service.QueueService;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/api")
public class QueueController {
  private final QueueService queueService;

  public QueueController(QueueService queueService) {
    this.queueService = queueService;
  }

  @GetMapping("organizations/{organizationId}/queues")
  public QueueResponseDto getQueues(
      @PathVariable UUID organizationId) {
    return queueService.getQueues(organizationId);
  }

  @GetMapping("queues/{queueId}/members")
  public String getMembers(@PathVariable UUID queueId) {
    return "";
  }

  // не определены
  @GetMapping("queues/{queueId}/settings")
  public String getSettings(@PathVariable UUID organizationId) {
    return null;
  }

  // обращение к сервису мерик через брокер
  @GetMapping("queues/{queueId}/metrics")
  public String getMetrics(@PathVariable UUID organizationId) {
    return null;
  }
}