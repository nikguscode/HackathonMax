package com.nikguscode.orchestrator.controller;

import com.nikguscode.orchestrator.core.service.authentication.MaxHashVerifyService;
import com.nikguscode.orchestrator.core.service.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Component
public class AuthenticationInterceptor implements HandlerInterceptor {
  private final UserService userService;

  @Autowired
  private MaxHashVerifyService maxHashVerifyService;

  public AuthenticationInterceptor(UserService userService) {
    this.userService = userService;
  }

  @Override
  public boolean preHandle(
      HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    try {
      Long maxIdHeader = Long.parseLong(request.getHeader("Max-Id"));
      String maxHashHeader = request.getHeader("Max-Hash");

      if (maxHashHeader == null) {
        throw new RuntimeException("Max hash header can't be null");
      }

      boolean isAuthenticated = userService.verifyUserAccess(maxIdHeader, maxHashHeader);

      if (!isAuthenticated) {
        response.sendError(
            HttpServletResponse.SC_UNAUTHORIZED, "Invalid authentication credentials.");
      }

      return isAuthenticated;
    } catch (NumberFormatException e) {
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Max-Id format.");
      return false;
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