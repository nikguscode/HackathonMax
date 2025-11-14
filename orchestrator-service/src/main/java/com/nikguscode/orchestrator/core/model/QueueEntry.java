package com.nikguscode.orchestrator.core.model;

import com.nikguscode.orchestrator.core.enums.enums.QueueEntryStatus;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Builder
@Getter
@ToString
public class QueueEntry {
  private final UUID id;
  private final UUID queueId;
  private final Long maxId;
  private final QueueEntryStatus status;
}