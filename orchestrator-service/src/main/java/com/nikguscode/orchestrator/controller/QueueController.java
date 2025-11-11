package com.nikguscode.orchestrator.controller;

import com.nikguscode.orchestrator.dao.queue.QueueDao;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/api")
public class QueueController {
  private final QueueDao queueDao;

  public QueueController(@Qualifier("jooqQueueDao") QueueDao queueDao) {
    this.queueDao = queueDao;
  }

  @GetMapping("organizations/{organizationId}/queues")
  public String getQueues(@PathVariable UUID organizationId) {
    return queueDao.findByOrganizationId(organizationId).toString();
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