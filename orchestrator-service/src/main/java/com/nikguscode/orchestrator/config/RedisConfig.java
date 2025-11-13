package com.nikguscode.orchestrator.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.nikguscode.orchestrator.dto.UserHashDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {
  private final String redisHost;
  private final Integer redisPort;
  private final String redisPassword;

  public RedisConfig(
      @Value("${spring.data.redis.host}") String redisHost,
      @Value("${spring.data.redis.port}") Integer redisPort,
      @Value("${spring.data.redis.password}") String redisPassword) {
    this.redisHost = redisHost;
    this.redisPort = redisPort;
    this.redisPassword = redisPassword;
  }

  @Bean
  public LettuceConnectionFactory lettuceConnectionFactory() {
    var config = new RedisStandaloneConfiguration(redisHost, redisPort);

    if (redisPassword != null && !redisPassword.isBlank()) {
      config.setPassword(redisPassword);
    }

    return new LettuceConnectionFactory(config);
  }

  @Bean
  public ObjectMapper redisObjectMapper() {
    ObjectMapper mapper = new ObjectMapper();
    mapper.registerModule(new JavaTimeModule());
    return mapper;
  }

  @Bean
  public RedisTemplate<String, UserHashDto> userRedisTemplate(
      RedisConnectionFactory connectionFactory, ObjectMapper redisObjectMapper) {
    RedisTemplate<String, UserHashDto> template = new RedisTemplate<>();
    template.setConnectionFactory(connectionFactory);

    template.setKeySerializer(new StringRedisSerializer());
    template.setHashKeySerializer(new StringRedisSerializer());

    Jackson2JsonRedisSerializer<UserHashDto> jsonSerializer =
        new Jackson2JsonRedisSerializer<>(redisObjectMapper, UserHashDto.class);

    template.setValueSerializer(jsonSerializer);
    template.setHashValueSerializer(jsonSerializer);

    template.afterPropertiesSet();
    return template;
  }
}