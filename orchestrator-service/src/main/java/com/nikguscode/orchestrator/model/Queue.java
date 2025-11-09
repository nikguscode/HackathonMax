package com.nikguscode.orchestrator.model;

import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Builder
@Getter
@ToString
public class Queue {
  private final UUID id;
  private final UUID organizationId;
  private final String name;
  private final OffsetDateTime createdAt;
}