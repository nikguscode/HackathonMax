package com.nikguscode.orchestrator.core.mapper;

import com.nikguscode.openapi.model.OrganizationDto;
import com.nikguscode.orchestrator.dao.result.OrganizationRecord;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrganizationDtoMapper {
  OrganizationRecord recordToDto(OrganizationDto dto);
}