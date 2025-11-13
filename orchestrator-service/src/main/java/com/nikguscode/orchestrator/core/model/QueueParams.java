package com.nikguscode.orchestrator.core.model;

import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@Builder
public class QueueParams {
  private final UUID id;
  private final UUID queueId;
  private final Integer arrivalGracePeriod;
  private final Integer maxQueueSize;
  private final boolean isActive = true;
}