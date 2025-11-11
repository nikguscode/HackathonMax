import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Flex, Panel, Typography } from '@maxhub/max-ui';
import { OrganizationsApi, Configuration } from '../api';
import logo from '/logo.jpg';


const createApiConfiguration = (): Configuration => {
  const basePath = import.meta.env.VITE_API_BASE_PATH || 'http://localhost:8080';
  return new Configuration({
    basePath,
  });
};

const OrganizationDetailsPage: React.FC = () => {
  const { id: orgId } = useParams<{ id: string }>();
  const [organizationName, setOrganizationName] = useState<string>(orgId ?? '');

  const MAX_CONTENT_WIDTH = '300px';
  const HORIZONTAL_PADDING = '16px';

  useEffect(() => {
    const loadOrganizationData = async () => {
      if (!orgId) {
        return;
      }

      try {
        const config = createApiConfiguration();
        const organizationsApi = new OrganizationsApi(config);
        
        const settingsResponse = await organizationsApi.getOrganizationSettings(orgId);
        if (settingsResponse.data?.organization?.name) {
          setOrganizationName(settingsResponse.data.organization.name);
        }
      } catch (err) {
        console.warn('Не удалось загрузить данные организации:', err);
      }
    };

    loadOrganizationData();
  }, [orgId]);

  if (!orgId) {
    return (
      <Container style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', padding: '20px' }}>
        <Typography.Title>Ошибка: ID организации не указан</Typography.Title>
      </Container>
    );
  }

  return (
    <Container
      style={{
        backgroundColor: '#ffffffff',
        minHeight: '100vh',
        padding: '0',
      }}
    >
      <Flex justify="center" align="center" style={{ padding: '0px 0 16px 0' }}>
        <img
          src={logo}
          alt="Logo"
          style={{
            maxWidth: '300px',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </Flex>

      <Flex
        direction="column"
        align="center"
        style={{
          width: '100%',
          maxWidth: MAX_CONTENT_WIDTH,
          margin: '0 auto',
          padding: `0 ${HORIZONTAL_PADDING} 100px ${HORIZONTAL_PADDING}`,
          boxSizing: 'border-box',
          gap: '16px',
        }}
      >
        <Panel
          mode="secondary"
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '0px',
            backgroundColor: '#F0F0F0',
            textAlign: 'center',
          }}
        >
          <Typography.Title
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: '#000000',
              margin: 0,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {organizationName}
          </Typography.Title>
        </Panel>

        {/* Область для метрик */}
        <Panel
          mode="secondary"
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '0px',
            backgroundColor: '#F0F0F0',
            textAlign: 'center',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography.Body
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#000000',
              margin: '4px 0',
              fontFamily: 'system-ui, sans-serif',
              textAlign: 'center',
            }}
          >
            Область для вывода метрик
          </Typography.Body>
          <Typography.Body
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#000000',
              margin: '4px 0',
              fontFamily: 'system-ui, sans-serif',
              textAlign: 'center',
            }}
          >
            ГРАФИКИ В МОБИЛЬНОЙ ВЕРСИИ
          </Typography.Body>
          <Typography.Body
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#000000',
              margin: '4px 0',
              fontFamily: 'system-ui, sans-serif',
              textAlign: 'center',
            }}
          >
            НЕ РИСУЕМ
          </Typography.Body>
        </Panel>

        {/* Параметры очереди */}
        <Panel
          mode="secondary"
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '0px',
            backgroundColor: '#F0F0F0',
            textAlign: 'center',
          }}
        >
          <Typography.Body
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#000000',
              margin: '4px 0',
              fontFamily: 'system-ui, sans-serif',
              textAlign: 'center',
            }}
          >
            Какие-то параметры
          </Typography.Body>
          <Typography.Body
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#000000',
              margin: '4px 0',
              fontFamily: 'system-ui, sans-serif',
              textAlign: 'center',
            }}
          >
            очереди, которые
          </Typography.Body>
          <Typography.Body
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#000000',
              margin: '4px 0',
              fontFamily: 'system-ui, sans-serif',
              textAlign: 'center',
            }}
          >
            определим потом
          </Typography.Body>
        </Panel>
      </Flex>
    </Container>
  );
};

export default OrganizationDetailsPage;

