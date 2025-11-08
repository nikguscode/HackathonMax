import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Flex, Button, Typography, Panel } from '@maxhub/max-ui';
import type { IQueueUser } from '../types';

const getMockQueueUsers = (queueId: string): IQueueUser[] => {
  if (queueId === 'q1') {
    return [
      { id: 'u1', name: 'Пользователь 1' },
      { id: 'u2', name: 'Пользователь 2' },
      { id: 'u3', name: 'Пользователь 3' },
      { id: 'u4', name: 'Пользователь 4' },
      { id: 'u5', name: 'Пользователь 5' },
      { id: 'u6', name: 'Пользователь 6' },
      { id: 'u7', name: 'Пользователь 7' },
      { id: 'u8', name: 'Пользователь 8' },
    ];
  }
  return [
    { id: 'u1', name: 'Пользователь 1' },
    { id: 'u2', name: 'Пользователь 2' },
  ];
};

const QueueUserManagementPage: React.FC = () => {
  const { id: queueId } = useParams<{ id: string }>();
  const [users, setUsers] = useState<IQueueUser[]>(() => {
    if (!queueId) return [];
    return getMockQueueUsers(queueId);
  });

  if (!queueId) {
    return (
      <Container style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', padding: '20px' }}>
        <Typography.Title>Ошибка: ID очереди не указан</Typography.Title>
      </Container>
    );
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  const handleAddUser = () => {
    const newUserId = `u${Date.now()}`;
    const newUser: IQueueUser = {
      id: newUserId,
      name: `Пользователь ${users.length + 1}`,
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  const MAX_CONTENT_WIDTH = '300px';
  const HORIZONTAL_PADDING = '16px';

  return (
    <Container
      style={{
        backgroundColor: '#ffffffff',
        minHeight: '100vh',
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Flex justify="center" align="center" style={{ padding: '0px 0 0px 0' }}>
        <img 
          src='/logo.jpg' 
          alt="Logo" 
          style={{ 
            maxWidth: '300px',
            height: 'auto',
            objectFit: 'contain'
          }} 
            />
      </Flex>
      <Flex
        direction="column"
        align="center"
        style={{
          width: '100%',
          maxWidth: MAX_CONTENT_WIDTH,
          height: 'auto',
          margin: '0 auto',
          padding: `20px ${HORIZONTAL_PADDING}`,
          boxSizing: 'border-box',
          gap: '12px',
          flex: 1,
          paddingBottom: '100px',
        }}
      >
        <Flex direction="column" align="center" style={{ width: '100%', gap: '12px', marginBottom: '12px' }}>
          {users.map((user) => (
            <Panel
              key={user.id}
              mode="secondary"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                border: '0.3px solid rgba(0, 0, 0, 0.15)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Flex gap={ 130 }>
                <Typography.Title
                  style={{
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#333333',
                    margin: 0,
                  }}
                >
                  {user.name}
                </Typography.Title>
              
              <Button
                mode="primary"
                onClick={() => handleDeleteUser(user.id)}
                style={{
                  minWidth: '24px',
                  width: '24px',
                  height: '24px',
                  padding: '0',
                  borderRadius: '4px',
                  backgroundColor: '#DC3545',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 4H13M5.5 4V3C5.5 2.44772 5.94772 2 6.5 2H9.5C10.0523 2 10.5 2.44772 10.5 3V4M12.5 4V13C12.5 13.5523 12.0523 14 11.5 14H4.5C3.94772 14 3.5 13.5523 3.5 13V4H12.5Z"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.5 7V11.5M9.5 7V11.5"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              </Flex>
            </Panel>
          ))}
        </Flex>

        <Button
          mode="secondary"
          onClick={handleAddUser}
          style={{
            width: '100%',
            borderRadius: '12px',
            padding: '12px 16px',
            backgroundColor: '#FFFFFF',
            border: '0.3px solid rgba(0, 0, 0, 0.15)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginBottom: '12px',
          }}
        >
          <Typography.Title
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: '#333333',
              margin: 0,
            }}
          >
            Добавить пользователя
          </Typography.Title>
        </Button>

      </Flex>
    </Container>
  );
};

export default QueueUserManagementPage;

