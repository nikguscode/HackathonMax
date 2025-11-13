package com.nikguscode.orchestrator.dto;

import com.nikguscode.openapi.model.QueueDto;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class OrganizationQueuesResponseDto {
  private final String organizationId;
  private final String organizationName;
  private final List<QueueDto> queues;
}