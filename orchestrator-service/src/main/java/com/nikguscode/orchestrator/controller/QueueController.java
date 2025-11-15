package com.nikguscode.orchestrator.controller;

import com.nikguscode.openapi.model.QueueCreatingRequestDto;
import com.nikguscode.openapi.model.QueueMembersResponseDto;
import com.nikguscode.openapi.model.QueueResponseDto;
import com.nikguscode.openapi.model.QueueSettingsDto;
import com.nikguscode.openapi.model.QueueSettingsResponseDto;
import com.nikguscode.openapi.model.QueueStaffResponseDto;
import com.nikguscode.orchestrator.core.mapper.UserDtoMapper;
import com.nikguscode.orchestrator.core.service.queue.QueueService;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/api")
public class QueueController {
  private final QueueService queueService;
  private final UserDtoMapper userDtoMapper;

  public QueueController(
      QueueService queueService,
      UserDtoMapper userDtoMapper) {
    this.queueService = queueService;
    this.userDtoMapper = userDtoMapper;
  }

  @PostMapping("organizations/{organizationId}/queues")
  public ResponseEntity<Void> createQueue(
      @PathVariable UUID organizationId, @RequestBody QueueCreatingRequestDto dto) {
    queueService.createQueue(organizationId, dto);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  @GetMapping("organizations/{organizationId}/queues")
  public QueueResponseDto getQueues(@PathVariable UUID organizationId) {
    return queueService.getQueues(organizationId);
  }

  @GetMapping("queues/{queueId}/staff")
  public ResponseEntity<QueueStaffResponseDto> getQueueStaff(@PathVariable UUID queueId) {
    return ResponseEntity.ok(queueService.getStaff(queueId));
  }

  @GetMapping("queues/{queueId}/members")
  public QueueMembersResponseDto getMembers(@PathVariable UUID queueId) {
    return queueService.getMembers(queueId);
  }

  // не определены
  @GetMapping("queues/{queueId}/settings")
  public QueueSettingsResponseDto getSettings(@PathVariable UUID queueId) {
    return new QueueSettingsResponseDto().settings(new QueueSettingsDto().name("test").arrivalGracePeriod(2).maxQueueSize(3).isActive(true));
  }
}