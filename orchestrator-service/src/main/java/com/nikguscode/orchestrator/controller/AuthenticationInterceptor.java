package com.nikguscode.orchestrator.controller;

import com.nikguscode.orchestrator.service.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Component
public class AuthenticationInterceptor implements HandlerInterceptor {
  private final UserService userService;

  public AuthenticationInterceptor(UserService userService) {
    this.userService = userService;
  }

  @Override
  public boolean preHandle(
      HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    Long maxIdHeader = Long.parseLong(request.getHeader("maxId"));
    String maxHashHeader = request.getHeader("maxHash");

    if (maxHashHeader == null) {
      throw new RuntimeException("zaglushka");
    }

    return userService.verifyUserAccess(maxIdHeader, maxHashHeader);
  }

  @Override
  public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
      ModelAndView modelAndView) throws Exception {
    HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
  }

  @Override
  public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
      Object handler, Exception ex) throws Exception {
    HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
  }
}