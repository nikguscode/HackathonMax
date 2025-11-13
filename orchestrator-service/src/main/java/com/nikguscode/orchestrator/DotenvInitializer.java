package com.nikguscode.orchestrator;

import io.github.cdimascio.dotenv.Dotenv;
import java.util.Arrays;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

public class DotenvInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {
  private static final String DOCKER_PROFILE = "docker";

  @Override
  public void initialize(ConfigurableApplicationContext applicationContext) {
    Environment env = applicationContext.getEnvironment();
    String[] activeProfiles = env.getActiveProfiles();

    if (Arrays.asList(activeProfiles).contains(DOCKER_PROFILE)) {
      System.out.println("Skipping Dotenv loading: 'docker' profile is active.");
      return;
    }

    Dotenv dotenv = Dotenv.configure()
        .directory("./shared")
        .load();

    dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
  }
}