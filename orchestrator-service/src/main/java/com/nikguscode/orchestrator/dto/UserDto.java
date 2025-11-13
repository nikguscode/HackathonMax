package com.nikguscode.orchestrator.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class UserDto {
  private final Long id;

  @JsonProperty("first_name")
  private final String firstName;

  @JsonProperty("last_name")
  private final String lastName;

  private final String username;

  @JsonProperty("language_code")
  private final String languageCode;

  @JsonProperty("photo_url")
  private final String photoUrl;

  @JsonCreator
  public UserDto(
      @JsonProperty("id") Long id,
      @JsonProperty("first_name") String firstName,
      @JsonProperty("last_name") String lastName,
      @JsonProperty("username") String username,
      @JsonProperty("language_code") String languageCode,
      @JsonProperty("photo_url") String photoUrl) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.languageCode = languageCode;
    this.photoUrl = photoUrl;
  }
}