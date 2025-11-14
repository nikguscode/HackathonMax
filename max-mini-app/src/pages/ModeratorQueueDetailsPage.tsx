import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Flex, Panel, Typography } from '@maxhub/max-ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Logo from '../components/Logo';

import {
  QueuesApi,
  OrganizationsApi,
  Configuration,
  QueueSettingsResponse,
  QueueMetricsResponse,
} from '../api';

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

const createApiConfiguration = (): Configuration => {
  const basePath =
    import.meta.env.VITE_API_BASE_PATH || "http://localhost:8080/v1/api";

  const authId = localStorage.getItem("authId");
  const maxHash = localStorage.getItem("maxHash");

  return new Configuration({
    basePath,
    baseOptions: {
      headers: {
        ...(authId ? { authId } : {}),
        ...(maxHash ? { maxHash } : {}),
      },
    },
  });
};

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

  const defaultShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  const pressedShadow = '0 0 1px rgba(0, 0, 0, 0.15)';

  const handleBack = () => navigate(-1);
  const handleManage = () => navigate(`/moderator-queue/queue/${queueId}`);

  useEffect(() => {
    if (!queueId) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      const config = createApiConfiguration();
      const queuesApi = new QueuesApi(config);
      const orgsApi = new OrganizationsApi(config);

      const authId = localStorage.getItem('authId') ?? '';
      const maxHash = localStorage.getItem('maxHash') ?? '';
      const orgId = localStorage.getItem('orgId') ?? '';

      if (!orgId) {
        setError('orgId не найден');
        setLoading(false);
        return;
      }

      try {
        const orgQueuesRes = await orgsApi.getOrganizationQueues(orgId, authId, maxHash);
        const queue = orgQueuesRes.data.queues?.find(q => q.id === queueId);
        setQueueName(queue?.name || `Очередь ${queueId}`);

        const [settingsRes, metricsRes, graphicsRes] = await Promise.all([
          queuesApi.getQueueSettings(queueId, authId, maxHash),
          queuesApi.getQueueMetrics(queueId, authId, maxHash),
          queuesApi.getQueueGraphics(queueId, authId, maxHash), 
        ]);

        setSettings(settingsRes.data.settings ?? null);
        setMetrics(metricsRes.data.metrics ?? null);

        const graphics = graphicsRes.data.graphics;
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

          setChartData(sortedData.length > 0 ? sortedData : null);
        } else {
          setChartData(null);
        }
      } catch (err: any) {
        console.error('API Error:', err);
        setError('Ошибка загрузки');
        setQueueName(`Очередь ${queueId}`);
        setChartData(null);
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

  // === Стили ===
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
          <Typography.Title style={{ fontSize: isDesktop ? '18px' : '15px', fontWeight: 500, margin: 0 }}>
            {queueName}
          </Typography.Title>
        </Panel>

        {isDesktop ? (
          <Flex direction="row" style={{ width: '100%', gap: '24px', flexWrap: 'wrap' }}>
          
            <Panel mode="secondary" style={{ flex: '1 1 45%', minWidth: '280px', padding: '20px', borderRadius: '12px', backgroundColor: '#F0F0F0' }}>
              <Typography.Title style={{ fontSize: '16px', margin: '0 0 12px' }}>Настройки</Typography.Title>
              {settings ? (
                <Flex direction="column" style={{ gap: '10px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Макс. размер:</span> <strong>{settings.maxQueueSize}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Льготный период:</span> <strong>{settings.arrivalGracePeriod} мин</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Статус:</span>
                    <strong style={{ color: settings.isActive ? '#00AA00' : '#CC0000' }}>
                      {settings.isActive ? 'Активна' : 'Неактивна'}
                    </strong>
                  </div>
                </Flex>
              ) : (
                <Typography.Body style={{ color: '#666' }}>Загрузка...</Typography.Body>
              )}
            </Panel>

            {/* Метрики */}
            <Panel mode="secondary" style={{ flex: '1 1 45%', minWidth: '280px', padding: '20px', borderRadius: '12px', backgroundColor: '#F0F0F0' }}>
              <Typography.Title style={{ fontSize: '16px', margin: '0 0 12px' }}>Метрики</Typography.Title>
              {metrics ? (
                <Flex direction="column" style={{ gap: '8px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>В очереди:</span> <strong>{metrics.entriesInTheQueue}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Ожидание:</span> <strong>{metrics.waitingTime} мин</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Обслужено:</span> <strong>{metrics.numberOfServedMembers}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Обслуживание:</span> <strong>{metrics.serviceTime} мин</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Ушедших:</span> <strong>{metrics.totalLeft}</strong>
                  </div>
                </Flex>
              ) : (
                <Typography.Body style={{ color: '#666' }}>Загрузка...</Typography.Body>
              )}
            </Panel>

            <Panel mode="secondary" style={{ flex: '1 1 100%', padding: '20px', borderRadius: '12px', backgroundColor: '#F0F0F0', minHeight: '300px' }}>
              <Typography.Title style={{ fontSize: '16px', margin: '0 0 16px' }}>Динамика за день</Typography.Title>
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
          <>
            <Panel mode="secondary" style={{ width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: '#F0F0F0' }}>
              {settings ? (
                <Flex direction="column" style={{ gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Макс. размер:</span> <strong>{settings.maxQueueSize}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Льготный период:</span> <strong>{settings.arrivalGracePeriod} мин</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Статус:</span>
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
                      <span>В очереди:</span> <strong>{metrics.entriesInTheQueue}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Ожидание:</span> <strong>{metrics.waitingTime} мин</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Обслужено:</span> <strong>{metrics.numberOfServedMembers}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Обслуживание:</span> <strong>{metrics.serviceTime} мин</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Ушедших:</span> <strong>{metrics.totalLeft}</strong>
                    </div>
                  </Flex>
                  <Typography.Body style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
                    Графики — только на десктопе
                  </Typography.Body>
                </Flex>
              )}
            </Panel>

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