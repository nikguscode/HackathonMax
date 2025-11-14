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

      String userJsonEncoded = queryParams.get("user");
      String chatJsonEncoded = queryParams.get("chat");

      if (userJsonEncoded == null || userJsonEncoded.isEmpty()) {
        log.error("Параметр 'user' отсутствует в rawMiniAppInitData.");
        throw new IllegalArgumentException("Missing 'user' data in init string.");
      }
      String userJsonDecoded = URLDecoder.decode(userJsonEncoded, StandardCharsets.UTF_8);
      UserDto user = objectMapper.readValue(userJsonDecoded, UserDto.class);

      MaxUserDataDto.MaxUserDataDtoBuilder maxUserDataDtoBuilder = MaxUserDataDto.builder()
          .user(user)
          .queryId(queryParams.get("query_id"))
          .hash(queryParams.get("hash"))
          .ip(queryParams.get("ip"))
          .authDate(Long.parseLong(queryParams.get("auth_date")))
          .startParam(queryParams.get("start_param"));

      if (chatJsonEncoded == null || chatJsonEncoded.isEmpty()) {
        log.warn("Параметр 'chat' отсутствует. MiniAppInitData не содержит данных о чате.");
        return maxUserDataDtoBuilder.build();
      }
      String chatJsonDecoded = URLDecoder.decode(chatJsonEncoded, StandardCharsets.UTF_8);
      ChatDto chat = objectMapper.readValue(chatJsonDecoded, ChatDto.class);

      return maxUserDataDtoBuilder
          .chat(chat)
          .build();
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

    return UriComponentsBuilder.fromUriString("?" + rawMiniAppInitData)
        .build()
        .getQueryParams()
        .toSingleValueMap();
  }
}