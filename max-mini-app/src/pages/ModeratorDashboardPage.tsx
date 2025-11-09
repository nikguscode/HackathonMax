import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Flex, Button, Typography } from '@maxhub/max-ui';
import { moderatorOrganizations } from '../mockData';
import type { IModeratorQueue } from '../types';
import logo from '/logo.jpg';

interface QueueCardProps {
  queue: IModeratorQueue;
  onClick?: () => void;
}

const QueueCard: React.FC<QueueCardProps> = ({ queue, onClick }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  const defaultShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  const pressedShadow = '0 0 1px rgba(0, 0, 0, 0.15)';

  return (
    <Flex
      direction="column"
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchCancel={handleMouseLeave}
      style={{
        width: '100%',
        padding: '16px',
        backgroundColor: '#FFFFFF',
        border: '0.3px solid rgba(0, 0, 0, 0.15)',
        borderRadius: '20px',
        boxShadow: isPressed ? pressedShadow : defaultShadow,
        cursor: onClick ? 'pointer' : 'default',
        marginBottom: '12px',
        transform: isPressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'all 0.15s ease',
        userSelect: 'none',
      }}
    >
      <Typography.Title
        style={{
          fontSize: '15px',
          fontWeight: 500,
          color: '#333333',
          margin: '0 0 8px 0',
        }}
      >
        {queue.name}
      </Typography.Title>
      
      <div
        style={{
          width: '100%',
          height: '2px',
          backgroundColor: '#DC3545',
          margin: '8px 0 12px 0',
        }}
      />
      
      <Flex direction="column" gap={8}>
        <Typography.Body
          style={{
            fontSize: '14px',
            color: '#000000',
            margin: 0,
          }}
        >
          Кол-во сотрудников: {queue.employeeCount}
        </Typography.Body>
        <Typography.Body
          style={{
            fontSize: '14px',
            color: '#000000',
            margin: 0,
          }}
        >
          Очередь в данный момент: {queue.currentQueue}
        </Typography.Body>
        <Typography.Body
          style={{
            fontSize: '14px',
            color: '#000000',
            margin: 0,
          }}
        >
          Всего людей обслужено: {queue.totalServed}
        </Typography.Body>
      </Flex>
    </Flex>
  );
};

const ModeratorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModeratorButtonPressed, setIsModeratorButtonPressed] = useState(false);
  const [isAddQueue, setisAddQueue] = useState(false);
  
  const moderatorOrg = moderatorOrganizations[0];
  
  if (!moderatorOrg) {
    return (
      <Container style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', padding: '20px' }}>
        <Typography.Title>Ошибка: Данные модератора не найдены</Typography.Title>
      </Container>
    );
  }

  const handleQueueClick = (queueId: string) => {
    navigate(`/managment/queue/${queueId}`);
  };

  const handleAddQueue = () => {
    console.log('Добавить очередь');
  };
  
  const handleAddQueueMouseDown = () => {
    setisAddQueue(true);
  };

  const handleAddQueueMouseUp = () => {
    setisAddQueue(false);
  };

  const handleAddQueueMouseLeave = () => {
    setisAddQueue(false);
  };

  const handleModeratorButtonClick = () => {
    navigate(`/organization/${moderatorOrg.id}`);
  };

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
  const defaultShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  const pressedShadow = '0 0 1px rgba(0, 0, 0, 0.15)';

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
        <Flex
          align="center"
          justify="space-between"
          onClick={handleModeratorButtonClick}
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
            borderRadius: '0px',
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
            {moderatorOrg.name}
          </Typography.Title>
        </Flex>

        <Flex direction="column" align="center" style={{ width: '100%', gap: '12px' }}>
          {moderatorOrg.queues.map((queue) => (
            <QueueCard
              key={queue.id}
              queue={queue}
              onClick={() => handleQueueClick(queue.id)}
            />
          ))}
        </Flex>

        <Flex
          align="center"
          justify="space-between"
          onClick={handleAddQueue}
          onMouseDown={handleAddQueueMouseDown}
          onMouseUp={handleAddQueueMouseUp}
          onMouseLeave={handleAddQueueMouseLeave}
          onTouchStart={handleAddQueueMouseDown}
          onTouchEnd={handleAddQueueMouseUp}
          onTouchCancel={handleAddQueueMouseLeave}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#FFFFFF',
            border: '0.3px solid rgba(0, 0, 0, 0.15)',
            borderRadius: '16px',
            boxShadow: isAddQueue ? pressedShadow : defaultShadow,
            cursor: 'pointer',
            marginBottom: '12px',
            transform: isAddQueue ? 'scale(0.98)' : 'scale(1)',
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
            Добавить очередь
          </Typography.Title>
        </Flex>
        
      </Flex>
    </Container>
  );
};

export default ModeratorDashboardPage;

