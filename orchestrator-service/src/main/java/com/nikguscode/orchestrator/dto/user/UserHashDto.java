package com.nikguscode.orchestrator.dto.user;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.nikguscode.orchestrator.core.model.User;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class UserHashDto {
  private final User user;
  private final String maxHash;

  @JsonCreator
  public UserHashDto(
      @JsonProperty("user") User user,
      @JsonProperty("maxHash") String maxHash) {
    this.user = user;
    this.maxHash = maxHash;
  }
}