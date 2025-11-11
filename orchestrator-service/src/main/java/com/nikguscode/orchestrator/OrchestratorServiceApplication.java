package com.nikguscode.orchestrator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy
public class OrchestratorServiceApplication {

  public static void main(String[] args) {
    SpringApplication.run(OrchestratorServiceApplication.class, args);
  }
}