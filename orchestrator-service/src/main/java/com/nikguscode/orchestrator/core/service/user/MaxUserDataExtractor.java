package com.nikguscode.orchestrator.core.service.user;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nikguscode.orchestrator.dto.ChatDto;
import com.nikguscode.orchestrator.dto.max.MaxUserDataDto;
import com.nikguscode.orchestrator.dto.user.UserDto;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
@Log4j2
public class MaxUserDataExtractor {
  private final ObjectMapper objectMapper;

  public MaxUserDataDto extract(String rawMiniAppInitData) {
    try {
      Map<String, String> queryParams = parseQueryString(rawMiniAppInitData);

      UserDto user = objectMapper.readValue(queryParams.get("user"), UserDto.class);
      ChatDto chat = objectMapper.readValue(queryParams.get("chat"), ChatDto.class);

      MaxUserDataDto dataDto = MaxUserDataDto.builder()
          .user(user)
          .chat(chat)
          .queryId(queryParams.get("query_id"))
          .hash(queryParams.get("hash"))
          .ip(queryParams.get("ip"))
          .authDate(Long.parseLong(queryParams.get("auth_date")))
          .build();

      return dataDto;
    } catch (JsonProcessingException e) {
      log.error("Не удалось десериализовать JSON из Max: {}", e.getMessage());
      throw new RuntimeException("Ошибка парсинга JSON данных", e);
    } catch (Exception e) {
      log.error("Не удалось извлечь данные пользователя: {}", e.getMessage());
      throw new RuntimeException("Общая ошибка извлечения данных", e);
    }
  }

  private Map<String, String> parseQueryString(String rawMiniAppInitData) {
    if (rawMiniAppInitData == null || rawMiniAppInitData.isEmpty()) {
      return Map.of();
    }

    String decodedData = URLDecoder.decode(rawMiniAppInitData, StandardCharsets.UTF_8);

    return UriComponentsBuilder.fromUriString("?" + decodedData)
        .build()
        .getQueryParams()
        .toSingleValueMap();
  }
}