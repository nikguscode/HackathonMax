package com.nikguscode.orchestrator.controller;

import com.nikguscode.orchestrator.core.service.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.UUID;
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
    try {
      if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
        return true;
      }

      UUID authId = UUID.fromString(request.getHeader("Auth-Id"));
      String maxHash = request.getHeader("Max-Hash");

      if (maxHash == null) {
        throw new RuntimeException("Max hash header can't be null");
      }

      boolean isAuthenticated = userService.verifyUserAccess(authId, maxHash);

      if (!isAuthenticated) {
        response.sendError(
            HttpServletResponse.SC_UNAUTHORIZED, "Invalid authentication credentials.");
      }

      return isAuthenticated;
    } catch (Exception e) {
      response.sendError(
          HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
          "An internal error occurred during authentication.");
      return false;
    }
  }

  @Override
  public void postHandle(
      HttpServletRequest request,
      HttpServletResponse response,
      Object handler,
      ModelAndView modelAndView) throws Exception {
    HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
  }

  @Override
  public void afterCompletion(
      HttpServletRequest request,
      HttpServletResponse response,
      Object handler,
      Exception ex) throws Exception {
    HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
  }
}