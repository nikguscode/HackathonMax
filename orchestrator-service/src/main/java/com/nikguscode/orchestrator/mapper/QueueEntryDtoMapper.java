package com.nikguscode.orchestrator.mapper;

import com.nikguscode.openapi.model.QueueEntryDto;
import com.nikguscode.orchestrator.dao.result.QueueEntryActiveRecord;
import org.mapstruct.Mapper;

@Mapper(
    componentModel = "spring",
    uses = {OrganizationDtoMapper.class, QueueEntryDtoMapper.class})
public interface QueueEntryDtoMapper {
  QueueEntryActiveRecord recordToDto(QueueEntryDto dto);
}