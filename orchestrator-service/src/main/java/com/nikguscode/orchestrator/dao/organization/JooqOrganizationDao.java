package com.nikguscode.orchestrator.dao.organization;

import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JooqOrganizationDao {
  private final DSLContext dsl;
}