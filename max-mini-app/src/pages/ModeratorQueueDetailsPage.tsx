import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Flex, Panel, Typography } from '@maxhub/max-ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Logo from '../components/Logo';

import {
  QueuesApi,
  Configuration,
  QueueSettingsResponse,
  QueueMetricsResponse,
} from '../api';

// === Адаптивность ===
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [query]);
  return matches;
};

// === Конфиг API ===
const createApiConfiguration = (): Configuration => {
  const basePath =
    import.meta.env.VITE_API_BASE_PATH || "http://localhost:8080/v1/api";

  const authId = sessionStorage.getItem("authId");
  const maxHash = sessionStorage.getItem("maxHash");

  return new Configuration({
    basePath,
    baseOptions: {
      headers: {
        ...(authId ? { 'Auth-Id': authId } : {}),
        ...(maxHash ? { 'Max-Hash': maxHash } : {}),
      },
    },
  });
};

/* ---------------------- Компонент ---------------------- */
const ModeratorQueueDetailsPage: React.FC = () => {
  const { id: queueId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [queueName, setQueueName] = useState<string>('Загрузка...');
  const [settings, setSettings] = useState<QueueSettingsResponse['settings'] | null>(null);
  const [metrics, setMetrics] = useState<QueueMetricsResponse['metrics'] | null>(null);
  const [chartData, setChartData] = useState<Array<{ time: string; inQueue: number; served: number }> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  // === Редактирование ===
  const [isEditing, setIsEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState<QueueSettingsResponse['settings'] | null>(null);

  const defaultShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  const pressedShadow = '0 0 1px rgba(0, 0, 0, 0.15)';

  const handleBack = () => navigate(-1);
  const handleManage = () => navigate(`/moderator-queue/queue/${queueId}`);

  // === Функции редактирования ===
  const startEditing = () => {
    setEditedSettings(settings);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedSettings(null);
  };

  const handleInputChange = (field: keyof NonNullable<typeof editedSettings>, value: string | boolean) => {
    if (!editedSettings) return;
    const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
    setEditedSettings({ ...editedSettings, [field]: numValue });
  };

  const isFormValid = editedSettings?.maxQueueSize !== undefined &&
                      editedSettings.maxQueueSize > 0 &&
                      editedSettings.arrivalGracePeriod !== undefined &&
                      editedSettings.arrivalGracePeriod >= 0;

  const saveSettings = async () => {
    if (!editedSettings || !isFormValid || !queueId) return;

    setLoading(true);
    const config = createApiConfiguration();
    const queuesApi = new QueuesApi(config);
    const authId = sessionStorage.getItem('authId') ?? '';
    const maxHash = sessionStorage.getItem('maxHash') ?? '';

    try {
      await queuesApi.updateQueueSettings(queueId, authId, maxHash);

      setSettings(editedSettings);
      setIsEditing(false);
      setEditedSettings(null);
    } catch (err) {
      console.error('Failed to update queue settings:', err);
      alert('Не удалось сохранить настройки очереди');
    } finally {
      setLoading(false);
    }
  };

  // === Загрузка данных ===
  useEffect(() => {
    if (!queueId) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      const config = createApiConfiguration();
      const queuesApi = new QueuesApi(config);

      const authId = sessionStorage.getItem('authId') ?? '';
      const maxHash = sessionStorage.getItem('maxHash') ?? '';
      const orgId = sessionStorage.getItem('orgId') ?? '';

      if (!orgId) {
        setError('orgId не найден');
        setLoading(false);
        return;
      }

    try {
      // === 1. Настройки ===
      let settingsData = null;
      try {
        const res = await queuesApi.getQueueSettings(queueId, authId, maxHash);
        settingsData = res.data.settings ?? null;
        setSettings(settingsData);
        setQueueName(settingsData?.name?.trim()
  ? settingsData.name.trim()
  : `Очередь ${queueId}`);
      } catch (err) {
        console.warn('getQueueSettings failed:', err);
      }

      // === 2. Метрики ===
      let metricsData = null;
      try {
        const res = await queuesApi.getQueueMetrics(queueId, authId, maxHash);
        metricsData = res.data.metrics ?? null;
        setMetrics(metricsData);
      } catch (err) {
        console.warn('getQueueMetrics failed:', err);
        setMetrics(null);
      }

      // === 3. Графики ===
      let chartDataResult = null;
      try {
        const res = await queuesApi.getQueueGraphics(queueId, authId, maxHash);
        const graphics = res.data.graphics;

        if (graphics) {
          const inQueueData = graphics.membersInQueueByTime || [];
          const waitingTimeData = graphics.averageWaitingTimeByTime || [];

          const timeMap = new Map<string, { time: string; inQueue: number; served: number }>();

          inQueueData.forEach(item => {
            if (item.time && item.count !== undefined) {
              timeMap.set(item.time, {
                time: item.time,
                inQueue: item.count,
                served: timeMap.get(item.time)?.served || 0,
              });
            }
          });

          let cumulativeServed = 0;
          const servedPerMinute = 1 / 5;
          waitingTimeData.forEach(item => {
            if (item.time && item.waitingTime !== undefined) {
              const entry = timeMap.get(item.time) || { time: item.time, inQueue: 0, served: 0 };
              const servedInPeriod = Math.max(0, Math.round(item.waitingTime * servedPerMinute));
              cumulativeServed += servedInPeriod;
              entry.served = cumulativeServed;
              timeMap.set(item.time, entry);
            }
          });

          const sortedData = Array.from(timeMap.values()).sort((a, b) =>
            a.time.localeCompare(b.time)
          );

          chartDataResult = sortedData.length > 0 ? sortedData : null;
        }
      } catch (err) {
        console.warn('getQueueGraphics failed:', err);
        chartDataResult = null;
      } finally {
        setChartData(chartDataResult);
      }

      // === Если ВСЁ упало — покажем хотя бы заголовок ===
      if (!settingsData && !metricsData && !chartDataResult) {
        setError('Не удалось загрузить данные');
      } else {
        setError(null);
      }

    } catch (err: any) {
      // Это уже не должно срабатывать
      console.error('Unexpected error:', err);
      setError('Критическая ошибка');
    } finally {
      setLoading(false);
    }
    };

    loadData();
  }, [queueId]);

  if (!queueId) {
    return (
      <Container style={{ backgroundColor: '#FFF', minHeight: '100vh', padding: '20px' }}>
        <Typography.Title>Ошибка: ID не указан</Typography.Title>
      </Container>
    );
  }

  const containerStyle = isDesktop
    ? { maxWidth: '800px', margin: '0 auto', padding: '24px', gap: '24px' }
    : { maxWidth: '300px', margin: '0 auto', padding: '0 16px 100px 16px', gap: '16px' };

  return (
    <Container style={{ backgroundColor: '#ffffffff', minHeight: '100vh', padding: 0 }}>
      <Logo onBack={handleBack} />

      <Flex direction="column" align="center" style={containerStyle}>
        <Panel
          mode="secondary"
          style={{
            width: '100%',
            padding: isDesktop ? '20px' : '16px',
            borderRadius: '12px',
            backgroundColor: '#F0F0F0',
            textAlign: 'center',
          }}
        >
          <Typography.Title style={{ fontSize: isDesktop ? '18px' : '15px', fontWeight: 500, margin: 0, color: '#333333' }}>
            {queueName}
          </Typography.Title>
        </Panel>

        {/* === ДЕСКТОП === */}
        {isDesktop ? (
          <Flex direction="row" style={{ width: '100%', gap: '24px', flexWrap: 'wrap' }}>

            {/* === Настройки (с редактированием) === */}
            <Panel mode="secondary" style={{ flex: '1 1 45%', minWidth: '280px', padding: '20px', borderRadius: '12px', backgroundColor: '#F0F0F0' }}>
              <Flex justify="space-between" align="center" style={{ marginBottom: '12px' }}>
                <Typography.Title style={{ fontSize: '16px', margin: 0 }}>Настройки</Typography.Title>
                {!isEditing ? (
                  <Typography.Title onClick={startEditing} style={{ fontSize: '14px', cursor: 'pointer', color: '#333333' }}>
                    Редактировать
                  </Typography.Title>
                ) : (
                  <Typography.Title onClick={cancelEditing} style={{ fontSize: '14px', color: '#666' }}>
                    Отмена
                  </Typography.Title>
                )}
              </Flex>

              {isEditing && editedSettings ? (
                <Flex direction="column" style={{ gap: '12px', fontSize: '14px' }}>
                  <input
                    type="number"
                    placeholder="Макс. размер очереди *"
                    value={editedSettings.maxQueueSize}
                    onChange={(e) => handleInputChange('maxQueueSize', e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      fontSize: '14px',
                      width: '96%',
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Льготный период (мин) *"
                    value={editedSettings.arrivalGracePeriod}
                    onChange={(e) => handleInputChange('arrivalGracePeriod', e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      fontSize: '14px',
                      width: '96%',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={editedSettings.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    />
                    <label htmlFor="isActive" style={{ cursor: 'pointer', userSelect: 'none' }}>
                      Очередь активна
                    </label>
                  </div>

                  {isFormValid && (
                    <Flex
                      onClick={saveSettings}
                      style={{
                        marginTop: '8px',
                        padding: '10px',
                        backgroundColor: '#00AA00',
                        color: 'white',
                        borderRadius: '8px',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontWeight: 500,
                        userSelect: 'none',
                        boxShadow: isPressed ? pressedShadow : defaultShadow,
                        transform: isPressed ? 'scale(0.98)' : 'scale(1)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseDown={() => setIsPressed(true)}
                      onMouseUp={() => setIsPressed(false)}
                      onMouseLeave={() => setIsPressed(false)}
                    >
                      Сохранить
                    </Flex>
                  )}
                </Flex>
              ) : settings ? (
                <Flex direction="column" style={{ gap: '10px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{color: '#333333' }}>Макс. размер:</span> <span style={{color: "#000000ff"}}>{settings.maxQueueSize}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{color: '#333333' }}>Льготный период:</span> <span style={{color: '#000000ff'}}>{settings.arrivalGracePeriod} мин</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{color: '#333333' }}>Статус:</span>
                    <strong style={{ color: settings.isActive ? '#00AA00' : '#CC0000' }}>
                      {settings.isActive ? 'Активна' : 'Неактивна'}
                    </strong>
                  </div>
                </Flex>
              ) : (
                <Typography.Body style={{ color: '#222121ff' }}>Загрузка...</Typography.Body>
              )}
            </Panel>

            {/* === Метрики === */}
            <Panel mode="secondary" style={{ flex: '1 1 45%', minWidth: '280px', padding: '20px', borderRadius: '12px', backgroundColor: '#F0F0F0' }}>
              <Typography.Title style={{ fontSize: '16px', margin: '0 0 12px' }}>Метрики</Typography.Title>
              {metrics ? (
                <Flex direction="column" style={{ gap: '8px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{color: '#333333' }}>В очереди:</span> <span style={{color: '#000000ff'}}>{metrics.entriesInTheQueue}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{color: '#333333' }}>Ожидание:</span> <span style={{color: '#000000ff'}}>{metrics.waitingTime} мин</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{color: '#333333' }}>Обслужено:</span> <span style={{color: '#000000ff'}}>{metrics.numberOfServedMembers}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{color: '#333333' }}>Обслуживание:</span> <span style={{color: '#000000ff'}}>{metrics.serviceTime} мин</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{color: '#333333' }}>Ушедших:</span> <span style={{color: '#000000ff'}}>{metrics.totalLeft}</span>
                  </div>
                </Flex>
              ) : (
                <Typography.Body style={{ color: '#666' }}>Загрузка...</Typography.Body>
              )}
            </Panel>

            {/* === График === */}
            <Panel mode="secondary" style={{ flex: '1 1 100%', padding: '20px', borderRadius: '12px', backgroundColor: '#F0F0F0', minHeight: '300px' }}>
              <Typography.Title style={{ color: '#333333', fontSize: '16px', margin: '0 0 16px' }}>Динамика за день</Typography.Title>
              {chartData ? (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="inQueue" stroke="#8884d8" name="В очереди" strokeWidth={2} />
                    <Line type="monotone" dataKey="served" stroke="#82ca9d" name="Обслужено" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Flex justify="center" align="center" style={{ height: 240 }}>
                  <Typography.Body style={{ color: '#666' }}>
                    {loading ? 'Загрузка графика...' : 'Нет данных за день'}
                  </Typography.Body>
                </Flex>
              )}
            </Panel>

            {/* === Кнопка управления === */}
            <Flex style={{ width: '100%' }} justify="center">
              <Flex
                onClick={handleManage}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onMouseLeave={() => setIsPressed(false)}
                onTouchStart={() => setIsPressed(true)}
                onTouchEnd={() => setIsPressed(false)}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '14px 20px',
                  backgroundColor: '#FFF',
                  border: '0.3px solid rgba(0,0,0,0.15)',
                  borderRadius: '16px',
                  boxShadow: isPressed ? pressedShadow : defaultShadow,
                  cursor: 'pointer',
                  transform: isPressed ? 'scale(0.98)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                }}
              >
                <Typography.Title style={{ fontSize: '16px', fontWeight: 500, margin: '0 auto', color: '#333' }}>
                  Управление очередью
                </Typography.Title>
              </Flex>
            </Flex>
          </Flex>
        ) : (
          /* === МОБИЛЬНАЯ ВЕРСИЯ === */
          <>
            {/* === Настройки (моб.) === */}
            <Panel mode="secondary" style={{ width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: '#F0F0F0' }}>
              <Flex justify="space-between" align="center" style={{ marginBottom: '12px' }}>
                <Typography.Title style={{ fontSize: '15px', margin: 0, color: '#333333' }}>Настройки</Typography.Title>
                {!isEditing && (
                  <Typography.Title onClick={startEditing} style={{ fontSize: '13px', color: '#333333' }}>
                    Редактировать
                  </Typography.Title>
                )}
              </Flex>

              {isEditing && editedSettings ? (
                <Flex direction="column" style={{ gap: '10px' }}>
                  <input
                    type="number"
                    placeholder="Макс. размер *"
                    value={editedSettings.maxQueueSize}
                    onChange={(e) => handleInputChange('maxQueueSize', e.target.value)}
                    style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '13px' }}
                  />
                  <input
                    type="number"
                    placeholder="Льготный период (мин) *"
                    value={editedSettings.arrivalGracePeriod}
                    onChange={(e) => handleInputChange('arrivalGracePeriod', e.target.value)}
                    style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '13px' }}
                  />
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      id="mobileIsActive"
                      checked={editedSettings.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    />
                    <label htmlFor="mobileIsActive" style={{ fontSize: '13px', cursor: 'pointer', color: "green" }}>
                      Активна
                    </label>
                  </div>

                  {isFormValid && (
                    <Flex
                      onClick={saveSettings}
                      style={{
                        marginTop: '8px',
                        padding: '10px',
                        backgroundColor: '#00AA00',
                        color: 'white',
                        borderRadius: '8px',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      Сохранить
                    </Flex>
                  )}
                  <Typography.Title onClick={cancelEditing} style={{ fontSize: '12px', textAlign: 'center', marginTop: '4px', color: 'red' }}>
                    Отмена
                  </Typography.Title>
                </Flex>
              ) : settings ? (
                <Flex direction="column" style={{ gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{color: '#333333' }}>Макс. размер:</span> <span style={{color: '#000000ff'}}>{settings.maxQueueSize}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{color: '#333333' }}>Льготный период:</span> <span style={{color: '#000000ff'}}>{settings.arrivalGracePeriod} мин</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{color: '#333333' }}>Статус:</span>
                    <strong style={{ color: settings.isActive ? '#00AA00' : '#CC0000' }}>
                      {settings.isActive ? 'Активна' : 'Неактивна'}
                    </strong>
                  </div>
                </Flex>
              ) : (
                <Typography.Body style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
                  Загрузка настроек...
                </Typography.Body>
              )}
            </Panel>

            {/* === Метрики (моб.) === */}
            <Panel
              mode="secondary"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: '#F0F0F0',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {loading && <Typography.Body style={{ color: '#666' }}>Загрузка...</Typography.Body>}
              {error && <Typography.Body style={{ color: '#FF0000' }}>{error}</Typography.Body>}
              {metrics && (
                <Flex direction="column" align="center" style={{ gap: '12px', width: '100%' }}>
                  <Typography.Title style={{ fontSize: '15px', margin: 0 }}>Метрики</Typography.Title>
                  <Flex direction="column" style={{ gap: '4px', fontSize: '13px', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{color: '#333333' }}>В очереди:</span> <span style={{color: '#000000ff'}}>{metrics.entriesInTheQueue}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{color: '#333333' }}>Ожидание:</span> <span style={{color: '#000000ff'}}>{metrics.waitingTime} мин</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{color: '#333333' }}>Обслужено:</span> <span style={{color: '#000000ff'}}>{metrics.numberOfServedMembers}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{color: '#333333' }}>Обслуживание:</span> <span style={{color: '#000000ff'}}>{metrics.serviceTime} мин</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{color: '#333333' }}>Ушедших:</span> <span style={{color: '#000000ff'}}>{metrics.totalLeft}</span>
                    </div>
                  </Flex>
                  <Typography.Body style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
                    Графики — только на десктопе
                  </Typography.Body>
                </Flex>
              )}
            </Panel>

            {/* === Кнопка управления (моб.) === */}
            <Flex
              onClick={handleManage}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onMouseLeave={() => setIsPressed(false)}
              onTouchStart={() => setIsPressed(true)}
              onTouchEnd={() => setIsPressed(false)}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#FFF',
                border: '0.3px solid rgba(0,0,0,0.15)',
                borderRadius: '16px',
                boxShadow: isPressed ? pressedShadow : defaultShadow,
                cursor: 'pointer',
                transform: isPressed ? 'scale(0.98)' : 'scale(1)',
                transition: 'all 0.15s ease',
                userSelect: 'none',
              }}
            >
              <Typography.Title style={{ fontSize: '15px', fontWeight: 500, margin: '0 auto', color: '#333' }}>
                Управление очередью
              </Typography.Title>
            </Flex>
          </>
        )}
      </Flex>
    </Container>
  );
};

export default ModeratorQueueDetailsPage;