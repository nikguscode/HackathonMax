package com.nikguscode.orchestrator.core.service.user;

import com.nikguscode.orchestrator.dto.UserHashDto;
import java.time.Duration;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCachingService {
  private static final Duration CACHE_TTL = Duration.ofMinutes(4);

  private final RedisTemplate<String, UserHashDto> userHashDtoRedisTemplate;
  private final String keyPrefix = "usersHash:";

  public UserHashDto getUserByMaxId(UUID authId) {
    if (authId == null) {
      throw new RuntimeException("zaglushka");
    }

    return userHashDtoRedisTemplate.opsForValue().get(createKey(authId));
  }

  public void saveOrUpdateUser(UUID authId, UserHashDto userHashDto) {
    userHashDtoRedisTemplate.opsForValue().set(
        createKey(authId),
        userHashDto,
        CACHE_TTL);
  }

  private String createKey(UUID authId) {
    return keyPrefix + authId;
  }
}