package com.nikguscode.orchestrator.core.mapper;

import com.nikguscode.openapi.model.MiniAppInitResponseDto;
import com.nikguscode.orchestrator.dto.max.MaxUserDataDto;
import java.util.UUID;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MiniAppDtoMapper {
  @Mapping(target = "maxHash", source = "maxUserDataDto.hash")
  MiniAppInitResponseDto userDataToMiniAppInitResponseDto(
      UUID authId, MaxUserDataDto maxUserDataDto);
}