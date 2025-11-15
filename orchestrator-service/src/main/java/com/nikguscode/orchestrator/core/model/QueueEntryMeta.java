package com.nikguscode.orchestrator.core.model;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

/**
 * <b>Data Model: Queue Entry Metadata</b>
 * <p>Data model representing time-related metadata for a specific queue entry. This class
 * tracks the entire lifecycle of a user within a queue, from joining to service completion.</p>
 *
 * <hr>
 *
 * <b>Модель данных: Метаданные записи в очереди</b>
 * <p>Модель данных, представляющая временные метаданные для конкретной записи в очереди. Класс отслеживает полный жизненный цикл
 * пользователя в очереди — от момента присоединения до завершения обслуживания.</p>
 */
@Builder
@Getter
@ToString
public class QueueEntryMeta {
  /**
   * <B>[EN]</B> The configured server time zone ID, injected from application properties.
   *
   * <HR>
   *
   * <B>[RU]</B> Настроенный идентификатор часовой зоны сервера, внедряется из свойств приложения.
   */
  private final static ZoneId zoneId = ZoneId.of("Europe/London");

  /**
   * <B>[EN]</B> The unique identifier for this metadata record.
   *
   * <HR>
   *
   * <B>[RU]</B> Уникальный идентификатор для данной записи метаданных.
   */
  @Builder.Default
  private final UUID id = UUID.randomUUID();

  /**
   * <B>[EN]</B> The foreign key linking this metadata to its parent queue entry (QueueEntry).
   *
   * <HR>
   *
   * <B>[RU]</B> Внешний ключ, связывающий эти метаданные с родительской записью в очереди (QueueEntry).
   */
  private final UUID queueEntryId;

  /**
   * <B>[EN]</B> The timestamp when the user was added to the queue.
   * <P>Initialized by default with the current time in the configured server time zone.</P>
   *
   * <HR>
   *
   * <B>[RU]</B> Время, когда пользователь встал в очередь.
   * <P>Инициализируется по умолчанию текущим временем в настроенной часовой зоне сервера.</P>
   */
  @Builder.Default
  private final OffsetDateTime joinedAt = OffsetDateTime.now(zoneId);

  /**
   * <B>[EN]</B> The timestamp when the user was called to service.
   *
   * <HR>
   *
   * <B>[RU]</B> Время, когда пользователь был приглашен на обслуживание.
   */
  private OffsetDateTime calledAt;

  /**
   * <B>[EN]</B> The timestamp at which arrival or presence is confirmed.
   *
   * <HR>
   *
   * <B>[RU]</B> Время, когда прибытие или присутствие подтверждено.
   */
  private OffsetDateTime arrivedAt;

  /**
   * <B>[EN]</B> The timestamp when the user was marked as missed (no-show).
   *
   * <HR>
   *
   * <B>[RU]</B> Время, когда пользователь был отмечен как пропустивший (не явился).
   */
  private OffsetDateTime missedAt;

  /**
   * <B>[EN]</B> The timestamp when the service or interaction officially began.
   *
   * <HR>
   *
   * <B>[RU]</B> Время, когда обслуживание или взаимодействие было официально начато.
   */
  private OffsetDateTime startedAt;

  /**
   * <B>[EN]</B> The timestamp when the service or interaction was officially concluded.
   *
   * <HR>
   *
   * <B>[RU]</B> Время, когда обслуживание или взаимодействие было официально завершено.
   */
  private OffsetDateTime finishedAt;
}