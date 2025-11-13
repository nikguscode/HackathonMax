package com.nikguscode.orchestrator.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.nikguscode.openapi.model.QueueDto;
import java.util.List;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class OrganizationQueuesResponseDto {
  private final String organizationId;
  private final String organizationName;
  private final List<QueueDto> queues;

  @JsonCreator
  public OrganizationQueuesResponseDto(
      @JsonProperty("organizationId") String organizationId,
      @JsonProperty("organizationName") String organizationName,
      @JsonProperty("queues") List<QueueDto> queues) {
    this.organizationId = organizationId;
    this.organizationName = organizationName;
    this.queues = queues;
  }
}