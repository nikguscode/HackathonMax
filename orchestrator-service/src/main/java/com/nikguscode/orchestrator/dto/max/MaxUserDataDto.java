package com.nikguscode.orchestrator.dto.max;

import com.nikguscode.orchestrator.dto.ChatDto;
import com.nikguscode.orchestrator.dto.user.UserDto;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Builder
@Getter
@ToString
public class MaxUserDataDto {
    private final UserDto user;
    private final ChatDto chat;
    private final String queryId;
    private final Long authDate;
    private final String hash;
    private final String ip;
    private final String startParam;
}