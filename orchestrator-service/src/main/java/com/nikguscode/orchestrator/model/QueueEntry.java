package com.nikguscode.orchestrator.model;

import com.nikguscode.openapi.model.QueueEntryStatusDto;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Builder
@Getter
@ToString
public class QueueEntry {
  private final UUID id;
  private final UUID QueueId;
  private final UUID userId;
  private final QueueEntryStatusDto status;
}