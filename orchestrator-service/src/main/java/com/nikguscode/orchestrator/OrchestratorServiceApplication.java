package com.nikguscode.orchestrator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class OrchestratorServiceApplication {
  public static void main(String[] args) {
    SpringApplication app = new SpringApplication(OrchestratorServiceApplication.class);
    app.addInitializers(new DotenvInitializer());
    app.run(args);
  }
}