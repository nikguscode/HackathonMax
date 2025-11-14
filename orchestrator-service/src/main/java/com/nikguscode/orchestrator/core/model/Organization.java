package com.nikguscode.orchestrator.core.model;

import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Builder
@Getter
@ToString
public class Organization {
  private final UUID id;
  private final String name;
  private final String description;
  private final String address;
  private final boolean isBanned;
  private final OffsetDateTime createdAt;
}