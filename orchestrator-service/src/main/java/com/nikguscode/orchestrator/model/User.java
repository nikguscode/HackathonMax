package com.nikguscode.orchestrator.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.OffsetDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Builder
@Getter
@ToString
public class User {
  private final Long idMax;
  private final String username;
  private final String firstName;
  private final String secondName;
  private final OffsetDateTime createdAt;

  @JsonCreator
  public User(
      @JsonProperty("idMax") Long idMax,
      @JsonProperty("username") String username,
      @JsonProperty("firstName") String firstName,
      @JsonProperty("secondName") String secondName,
      @JsonProperty("createdAt") OffsetDateTime createdAt) {
    this.idMax = idMax;
    this.username = username;
    this.firstName = firstName;
    this.secondName = secondName;
    this.createdAt = createdAt;
  }
}