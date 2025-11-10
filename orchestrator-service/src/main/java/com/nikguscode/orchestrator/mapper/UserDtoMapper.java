package com.nikguscode.orchestrator.mapper;

import com.nikguscode.openapi.model.UserCreatingRequestDto;
import com.nikguscode.openapi.model.UserResponseDto;
import com.nikguscode.orchestrator.model.Organization;
import com.nikguscode.orchestrator.model.QueueEntry;
import com.nikguscode.orchestrator.model.User;
import java.time.OffsetDateTime;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserDtoMapper {
  @Mapping(target = "idMax", source = "dto.maxId")
  @Mapping(target = "createdAt", source = "createdAt")
  User dtoToUser(UserCreatingRequestDto dto, OffsetDateTime createdAt);

  UserResponseDto entitiesToDto(List<Organization> organizations, List<QueueEntry> queueEntries);
}