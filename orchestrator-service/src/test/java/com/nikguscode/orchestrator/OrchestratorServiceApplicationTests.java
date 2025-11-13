package com.nikguscode.orchestrator;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.connection.RedisConnectionFactory;

@SpringBootTest
class OrchestratorServiceApplicationTests {

  @MockBean
  private ReactiveRedisConnectionFactory reactiveRedisConnectionFactory;

  @MockBean
  private RedisConnectionFactory redisConnectionFactory;

	@Test
	void contextLoads() {
	}
}