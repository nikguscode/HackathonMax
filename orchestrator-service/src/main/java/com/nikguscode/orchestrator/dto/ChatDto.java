package com.nikguscode.orchestrator.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class ChatDto {
  private final Long id;
  private final String type;

  @JsonCreator
  public ChatDto(
      @JsonProperty("id") Long id,
      @JsonProperty("type") String type) {
    this.id = id;
    this.type = type;
  }
}