package com.nikguscode.orchestrator.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

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
}