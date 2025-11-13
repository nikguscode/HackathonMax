package com.nikguscode.orchestrator.config;

import com.nikguscode.orchestrator.controller.AuthenticationInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
  private final AuthenticationInterceptor authenticationInterceptor;
  private final String pathPrefix;

  public WebConfig(
      AuthenticationInterceptor authenticationInterceptor,
      @Value("${server.path.prefix}") String pathPrefix) {
    this.authenticationInterceptor = authenticationInterceptor;
    this.pathPrefix = pathPrefix;
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
        .allowedOriginPatterns(
            "http://localhost:*", "http://45.135.135.32:*",
            "http://host.docker.internal:*", "https://maxqueue.freeddns.org")
        .allowedMethods("*")
        .allowedHeaders("*")
        .allowCredentials(true)
        .maxAge(30);
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(authenticationInterceptor)
        .addPathPatterns(pathPrefix + "/**")
        .excludePathPatterns(pathPrefix + "/users/{maxId}/mini-app");
  }
}