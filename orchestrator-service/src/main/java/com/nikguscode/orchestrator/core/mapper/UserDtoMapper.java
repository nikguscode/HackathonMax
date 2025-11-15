package com.nikguscode.orchestrator.core.mapper;

import com.nikguscode.openapi.model.QueueStaffDto;
import com.nikguscode.openapi.model.QueueStaffResponseDto;
import com.nikguscode.openapi.model.UserCreatingRequestDto;
import com.nikguscode.openapi.model.UserResponseDto;
import com.nikguscode.orchestrator.core.model.User;
import com.nikguscode.orchestrator.dao.result.OrganizationRecord;
import com.nikguscode.orchestrator.dao.result.QueueEntryActiveRecord;
import com.nikguscode.orchestrator.dao.result.StaffRecord;
import com.nikguscode.orchestrator.dto.user.UserDto;
import com.nikguscode.orchestrator.dto.user.UserHashDto;
import java.time.OffsetDateTime;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserDtoMapper {
  @Mapping(target = "idMax", source = "dto.maxId")
  @Mapping(target = "createdAt", source = "createdAt")
  User toUser(UserCreatingRequestDto dto, OffsetDateTime createdAt);

  UserResponseDto toResponseDto(
      List<OrganizationRecord> organizations, List<QueueEntryActiveRecord> queueEntries);

  UserHashDto toHashDto(User user, String maxHash);

  @Mapping(target = "createdAt", source = "createdAt")
  @Mapping(target = "idMax", source = "userDto.id")
  User toUser(UserDto userDto, OffsetDateTime createdAt);

  List<QueueStaffDto> toStaffDto(List<StaffRecord> staffRecord);
}