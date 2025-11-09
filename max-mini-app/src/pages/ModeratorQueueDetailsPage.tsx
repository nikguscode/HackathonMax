import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Flex, Panel, Typography } from '@maxhub/max-ui';
// import { QueuesApi, Configuration } from '../api';
import logo from '/logo.jpg';

// const createApiConfiguration = (): Configuration => {
//   const basePath = import.meta.env.VITE_API_BASE_PATH || 'http://localhost:8080';
//   return new Configuration({
//     basePath,  
//   });
// };

const ModeratorQueueDetailsPage: React.FC = () => {
  const { id: queueId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [queueName, setQueueName] = useState<string>('Название очереди');
  const [isModeratorButtonPressed, setIsModeratorButtonPressed] = useState(false);

  const defaultShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  const pressedShadow = '0 0 1px rgba(0, 0, 0, 0.15)';

  const handleModeratorMouseDown = () => {
    setIsModeratorButtonPressed(true);
  };

  const handleModeratorMouseUp = () => {
    setIsModeratorButtonPressed(false);
  };

  const handleModeratorMouseLeave = () => {
    setIsModeratorButtonPressed(false);
  };

  const MAX_CONTENT_WIDTH = '300px';
  const HORIZONTAL_PADDING = '16px';

  useEffect(() => {
    const loadQueueData = async () => {
      if (!queueId) {
        return;
      }

      try {
        // const config = createApiConfiguration();
        // const queuesApi = new QueuesApi(config);
        
        // В будущем можно загружать название очереди из API
        // Пока используем placeholder
        setQueueName(`Очередь ${queueId}`);
      } catch (err) {
        console.warn('Не удалось загрузить данные очереди:', err);
      }
    };

    loadQueueData();
  }, [queueId]);

  if (!queueId) {
    return (
      <Container style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', padding: '20px' }}>
        <Typography.Title>Ошибка: ID очереди не указан</Typography.Title>
      </Container>
    );
  }

  const handleQueueManagement = () => {
    navigate(`/managment/queue/${queueId}`);
  };

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
        {/* Название очереди */}
        <Panel
          mode="secondary"
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
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
            {queueName}
          </Typography.Title>
        </Panel>

        {/* Параметры очереди */}
        <Panel
          mode="secondary"
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
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

        {/* Область для метрик */}
        <Panel
          mode="secondary"
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
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

        <Flex
          align="center"
          justify="space-between"
          onClick={handleQueueManagement}
          onMouseDown={handleModeratorMouseDown}
          onMouseUp={handleModeratorMouseUp}
          onMouseLeave={handleModeratorMouseLeave}
          onTouchStart={handleModeratorMouseDown}
          onTouchEnd={handleModeratorMouseUp}
          onTouchCancel={handleModeratorMouseLeave}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#FFFFFF',
            border: '0.3px solid rgba(0, 0, 0, 0.15)',
            borderRadius: '16px',
            boxShadow: isModeratorButtonPressed ? pressedShadow : defaultShadow,
            cursor: 'pointer',
            marginBottom: '12px',
            transform: isModeratorButtonPressed ? 'scale(0.98)' : 'scale(1)',
            transition: 'all 0.15s ease',
            userSelect: 'none',
          }}
        >
          <Typography.Title
            
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: '#333333',
              margin: '0 auto',
            }}
          >
            Управление очередью
          </Typography.Title>
        </Flex>
      </Flex>
    </Container>
  );
};

export default ModeratorQueueDetailsPage;

