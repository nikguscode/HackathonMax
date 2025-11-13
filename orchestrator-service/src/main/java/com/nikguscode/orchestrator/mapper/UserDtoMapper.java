package com.nikguscode.orchestrator.mapper;

import com.nikguscode.openapi.model.UserCreatingRequestDto;
import com.nikguscode.openapi.model.UserResponseDto;
import com.nikguscode.orchestrator.dao.result.OrganizationRecord;
import com.nikguscode.orchestrator.dao.result.QueueEntryActiveRecord;
import com.nikguscode.orchestrator.dto.MaxUserDataDto;
import com.nikguscode.orchestrator.dto.UserDto;
import com.nikguscode.orchestrator.dto.UserHashDto;
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

  UserResponseDto dtoToResponse(
      List<OrganizationRecord> organizations, List<QueueEntryActiveRecord> queueEntries);

  UserHashDto userToHashDto(User user, String maxHash);

  @Mapping(target = "createdAt", source = "createdAt")
  @Mapping(target = "user.idMax", source = "userDto.id")
  User userToMaxUserDataDto(UserDto userDto, OffsetDateTime createdAt);


}