package com.nikguscode.orchestrator.core.mapper;

import com.nikguscode.openapi.model.MiniAppInitResponseDto;
import com.nikguscode.orchestrator.dto.MaxUserDataDto;
import com.nikguscode.orchestrator.dto.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MiniAppDtoMapper {
  @Mapping(target = "maxId", source = "userDto.id")
  @Mapping(target = "maxHash", source = "maxUserDataDto.hash")
  MiniAppInitResponseDto userDataToMiniAppInitResponseDto(
      UserDto userDto, MaxUserDataDto maxUserDataDto);
}