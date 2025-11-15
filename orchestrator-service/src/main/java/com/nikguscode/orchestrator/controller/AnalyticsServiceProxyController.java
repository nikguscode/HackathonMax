package com.nikguscode.orchestrator.controller;

import com.nikguscode.openapi.model.QueueMetricsDto;
import com.nikguscode.openapi.model.QueueMetricsResponseDto;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/api")
public class AnalyticsServiceProxyController {
  @GetMapping("/queues/{queueId}/metrics")
  public QueueMetricsResponseDto getQueueMetrics(@PathVariable UUID queueId) {
    return new QueueMetricsResponseDto().metrics(new QueueMetricsDto()
        .waitingTime(1f)
        .entriesInTheQueue(1)
        .numberOfServedMembers(1)
        .serviceTime(1f)
        .totalLeft(3)
        .maxInQueue(2)
        .minInQueue(1)
        .averageInQueue(3));

  }
}