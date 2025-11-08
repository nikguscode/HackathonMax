package com.nikguscode.orchestrator.mapper;

import com.nikguscode.openapi.model.UserRequestDto;
import com.nikguscode.orchestrator.model.User;
import java.time.OffsetDateTime;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserDtoMapper {
  @Mapping(target = "idMax", source = "dto.maxId")
  @Mapping(target = "createdAt", source = "createdAt")
  User dtoToUser(UserRequestDto dto, OffsetDateTime createdAt);
}