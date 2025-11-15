import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Flex, Panel, Typography } from '@maxhub/max-ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Logo from '../components/Logo';

import {
  OrganizationsApi,
  Configuration,
  OrganizationSettingsResponse,
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
  const basePath = import.meta.env.VITE_API_BASE_PATH
    ? `${import.meta.env.VITE_API_BASE_PATH.replace(/\/+$/, '')}/v1/api`
    : 'http://localhost:8080/v1/api';

  const authId = sessionStorage.getItem('authId') ?? '';
  const maxHash = sessionStorage.getItem('maxHash') ?? '';

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
const OrganizationDetailsPage: React.FC = () => {
  const { id: orgId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [orgName, setOrgName] = useState<string>('Загрузка...');
  const [settings, setSettings] = useState<OrganizationSettingsResponse['organization'] | null>(null);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [chartData, setChartData] = useState<Array<{ time: string; load: number; servedTotal: number }> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPressed, setIsPressed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState<OrganizationSettingsResponse['organization'] | null>(null);

  const defaultShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  const pressedShadow = '0 0 1px rgba(0, 0, 0, 0.15)';

  const handleBack = () => navigate(-1);
  const handleManage = () => navigate(`/moderator-organization/${orgId}`);

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedSettings(null);
  };

  const handleInputChange = (field: keyof NonNullable<typeof editedSettings>, value: string | boolean) => {
    if (!editedSettings) return;
    setEditedSettings({ ...editedSettings, [field]: value });
  };

  const isFormValid = editedSettings?.name && editedSettings.name.trim() !== '';

  const saveSettings = async () => {
    if (!editedSettings || !isFormValid) return;

    setLoading(true);
    const config = createApiConfiguration();
    const orgsApi = new OrganizationsApi(config);
    const authId = sessionStorage.getItem('authId') ?? '';
    const maxHash = sessionStorage.getItem('maxHash') ?? '';

    try {
      await orgsApi.updateSettingsOrganization(orgId ?? '', authId, maxHash, {
        organization: editedSettings,
      });

      // Обновляем оригинальные настройки
      setSettings(editedSettings);
      setIsEditing(false);
      setEditedSettings(null);
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Не удалось сохранить настройки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orgId) return;

    const loadData = async () => {
      setLoading(true);

      const config = createApiConfiguration();
      const orgsApi = new OrganizationsApi(config);

      const authId = sessionStorage.getItem('authId') ?? '';
      const maxHash = sessionStorage.getItem('maxHash') ?? '';

    try {
      const results = await Promise.allSettled([
        orgsApi.getOrganizationSettings(orgId, authId, maxHash),
        orgsApi.getOrganizationMetrics(orgId, authId, maxHash),
        orgsApi.getOrganizationGraphics(orgId, authId, maxHash),
      ]);

      const [settingsRes, metricsRes, graphicsRes] = results;

      let hasAnyData = false;

      if (settingsRes.status === 'fulfilled') {
        const org = settingsRes.value.data.organization ?? null;
        setSettings(org);
        setOrgName(org?.name || `Организация ${orgId}`);
        if (org) hasAnyData = true;
      } else {
        console.warn('getOrganizationSettings failed:', settingsRes.reason);
        setOrgName(`Организация ${orgId}`);
      }

      if (metricsRes.status === 'fulfilled') {
        const metrics = metricsRes.value.data.metrics ?? null;
        setMetrics(metrics);
        if (metrics) hasAnyData = true;
      } else {
        console.warn('getOrganizationMetrics failed:', metricsRes.reason);
        setMetrics(null);
      }

      let chartDataResult: typeof chartData = null;
      if (graphicsRes.status === 'fulfilled') {
        const graphics = graphicsRes.value.data.graphics;
        if (graphics?.throughputByTime || graphics?.totalLoadByTime) {
          const loadData = graphics.totalLoadByTime || [];
          const throughputData = graphics.throughputByTime || [];

          const timeMap = new Map<string, { time: string; load: number; servedTotal: number }>();

          loadData.forEach(item => {
            if (item.time && item.totalLoad !== undefined) {
              timeMap.set(item.time, {
                time: item.time,
                load: item.totalLoad,
                servedTotal: timeMap.get(item.time)?.servedTotal || 0,
              });
            }
          });

          let cumulative = 0;
          throughputData.forEach(item => {
            if (item.time && item.throughput !== undefined) {
              const entry = timeMap.get(item.time) || { time: item.time, load: 0, servedTotal: 0 };
              cumulative += item.throughput;
              entry.servedTotal = cumulative;
              timeMap.set(item.time, entry);
            }
          });

          const sorted = Array.from(timeMap.values()).sort((a, b) => a.time.localeCompare(b.time));
          chartDataResult = sorted.length > 0 ? sorted : null;

          if (chartDataResult) hasAnyData = true;
        }
      } else {
        console.warn('getOrganizationGraphics failed:', graphicsRes.reason);
      }

      setChartData(chartDataResult);

      // === Ошибка только если НИЧЕГО не загрузилось ==

    } catch (error) {
      console.error('Critical error (should not happen):', error);
    } finally {
      setLoading(false);
    }
    };

    loadData();
  }, [orgId]);

  if (!orgId) {
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
    <Container style={{ minHeight: '100vh', padding: 0 }}>
      <Logo onBack={handleBack} />

      <Flex direction="column" align="center" style={containerStyle}>
        {/* Название */}
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
            {orgName}
          </Typography.Title>
        </Panel>

        {/* Десктоп */}
        {isDesktop ? (
          <Flex direction="row" style={{ width: '100%', gap: '24px', flexWrap: 'wrap' }}>
            {/* Информация */}
          <Panel mode="secondary" style={{ flex: '1 1 45%', minWidth: '280px', padding: '20px', borderRadius: '12px', backgroundColor: '#F0F0F0' }}>
            <Flex justify="space-between" align="center" style={{ marginBottom: '12px' }}>
              <Typography.Title style={{ fontSize: '16px', margin: 0 }}>Настройки</Typography.Title>
            </Flex>

            {isEditing && editedSettings ? (
              <Flex direction="column" style={{ gap: '12px', fontSize: '14px' }}>
                <input
                  type="text"
                  placeholder="Название организации *"
                  value={editedSettings.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    width: '97%',
                  }}
                />
                <input
                  type="text"
                  placeholder="Адрес"
                  value={editedSettings.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    width: '97%',
                  }}
                />
                <input
                  type="text"
                  placeholder="Описание"
                  value={editedSettings.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    width: '97%',
                  }}
                />

                {/* Кнопка "Сохранить" — только если валидно */}
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
                  <span>Адрес:</span> <strong>{settings.address || '—'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Статус:</span>
                  <strong style={{ color: settings.isBanned ? '#CC0000' : '#00AA00' }}>
                    {settings.isBanned ? 'Заблокирована' : 'Активна'}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Создано:</span>
                  <strong>
                    {settings.createdAt ? new Date(settings.createdAt).toLocaleDateString('ru-RU') : '—'}
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
                    <span>Активных очередей:</span> <strong>{metrics.activeQueues}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Всего обслужено:</span> <strong>{metrics.totalServed}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Ушедших:</span> <strong>{metrics.totalLeft}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Среднее ожидание:</span> <strong>{metrics.avgWaitingTime} мин</strong>
                  </div>
                </Flex>
              ) : (
                <Typography.Body style={{ color: '#666' }}>Загрузка...</Typography.Body>
              )}
            </Panel>

            {/* График */}
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
                    <Line type="monotone" dataKey="load" stroke="#8884d8" name="Нагрузка" strokeWidth={2} />
                    <Line type="monotone" dataKey="servedTotal" stroke="#82ca9d" name="Обслужено (всего)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Flex justify="center" align="center" style={{ height: 240 }}>
                  <Typography.Body style={{ color: '#666' }}>
                    {loading ? 'Загрузка...' : 'Нет данных'}
                  </Typography.Body>
                </Flex>
              )}
            </Panel>

          </Flex>
        ) : (
          /* === МОБИЛЬНАЯ ВЕРСИЯ === */
          <>
      <Panel mode="secondary" style={{ width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: '#F0F0F0' }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: '12px' }}>
          <Typography.Title style={{ fontSize: '15px', margin: 0 }}>Настройки</Typography.Title>
        </Flex>

        {isEditing && editedSettings ? (
          <Flex direction="column" style={{ gap: '10px' }}>
            <input
              type="text"
              placeholder="Название *"
              value={editedSettings.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '13px' }}
            />
            <input
              type="text"
              placeholder="Адрес"
              value={editedSettings.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '13px' }}
            />
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
            <Typography.Title onClick={cancelEditing} style={{ fontSize: '12px', textAlign: 'center', marginTop: '4px' }}>
              Отмена
            </Typography.Title>
          </Flex>
  ) : settings ? (
    <Flex direction="column" style={{ gap: '8px', fontSize: '13px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Адрес:</span> <strong>{settings.address || '—'}</strong>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Статус:</span>
        <strong style={{ color: settings.isBanned ? '#CC0000' : '#00AA00' }}>
          {settings.isBanned ? 'Заблокирована' : 'Активна'}
        </strong>
      </div>
    </Flex>
  ) : (
    <Typography.Body style={{ fontSize: '13px', color: '#666', textAlign: 'center' }}>
      Загрузка...
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
              {metrics ? (
                <Flex direction="column" align="center" style={{ gap: '12px', width: '100%' }}>
                  <Typography.Title style={{ fontSize: '15px', margin: 0 }}>Метрики</Typography.Title>
                  <Flex direction="column" style={{ gap: '4px', fontSize: '13px', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Активных очередей:</span> <strong>{metrics.activeQueues}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Всего обслужено:</span> <strong>{metrics.totalServed}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Ушедших:</span> <strong>{metrics.totalLeft}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Среднее ожидание:</span> <strong>{metrics.avgWaitingTime} мин</strong>
                    </div>
                  </Flex>
                  <Typography.Body style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
                    Графики — только на десктопе
                  </Typography.Body>
                </Flex>
              ) : (
                <Typography.Body style={{ color: '#666' }}>Загрузка...</Typography.Body>
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
                Управление организацией
              </Typography.Title>
            </Flex>
          </>
        )}
      </Flex>
    </Container>
  );
};

export default OrganizationDetailsPage;