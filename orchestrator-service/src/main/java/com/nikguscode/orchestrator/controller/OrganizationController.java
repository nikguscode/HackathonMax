package com.nikguscode.orchestrator.controller;

import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/organizations")
public class OrganizationController {
  // настройки ещё не расписаны
  @GetMapping("/{organizationId}/settings")
  public String getSettings(@PathVariable UUID organizationId) {
    return null;
  }

  // обращение к сервису метрик через rabbitmq
  @GetMapping("/{organizationId}/metrics")
  public String getMetrics(@PathVariable UUID organizationId) {
    return null;
  }
}