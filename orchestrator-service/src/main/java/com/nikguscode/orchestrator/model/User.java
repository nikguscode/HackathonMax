package com.nikguscode.orchestrator.model;

import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Builder
@Getter
@ToString
public class User {
  private final UUID idMax;
  private final String username;
  private final String firstName;
  private final String secondName;
  private final OffsetDateTime createdAt;
}