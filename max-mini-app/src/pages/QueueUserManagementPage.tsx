import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Flex, Typography } from '@maxhub/max-ui';
import AddUserModal from '../components/AddUserModal';
import Logo from '../components/Logo';
import { QueueMember, QueuesApi, Configuration, QueueEntriesApi } from '../api';
import ConfirmationModal from '../components/ConfirmationModal';
import SwipeableUserItem from '../components/SwipeableUserItem';

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


const QueueUserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: queueId } = useParams<{ id: string }>();
  const [users, setUsers] = useState<QueueMember[]>([]);
  const [isAddQueue, setisAddQueue] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserEntryId, setSelectedUserEntryId] = useState<string | null>(null);

  const authId = localStorage.getItem("authId") ?? '';
  const maxHash = localStorage.getItem("maxHash") ?? '';

  const handleServedUser = async (entryId: string) => {
      if (!entryId) {
        console.warn('⚠️ entryId is undefined — пропускаем удаление');
        return;
      }
      try {
        console.log('🟡 Отправляем запрос на удаление:', entryId);

        const config = createApiConfiguration();
        const queueEntriesApi = new QueueEntriesApi(config);

        await queueEntriesApi.updateQueueEntryStatus(entryId, authId, maxHash, {status: "SERVING"});

        setUsers(prevUsers => prevUsers.filter(user => user.queueEntryId!== entryId));

        console.log('✅ Пользователь удалён локально:', entryId);
      } catch (err){
        console.error('Ошибка при удалении пользователя:', err);
      }
  };

  const handleConfirmUser = async (entryId: string) => {
      if (!entryId) {
        console.warn('⚠️ entryId is undefined — пропускаем удаление');
        return;
      }
      try {
        console.log('🟡 Отправляем запрос на удаление:', entryId);

        const config = createApiConfiguration();
        const queueEntriesApi = new QueueEntriesApi(config);

        await queueEntriesApi.updateQueueEntryStatus(entryId, authId, maxHash, {status: "SERVED"});

        setUsers(prevUsers => prevUsers.filter(user => user.queueEntryId!== entryId));

        console.log('✅ Пользователь удалён локально:', entryId);
      } catch (err){
        console.error('Ошибка при удалении пользователя:', err);
      }
  };

  const handleDeleteUser = ( entryId: string ) => {
    setSelectedUserEntryId(entryId);
    setIsModalOpen(true);
  };

  const handleAddUserMouseDown = () => {
    setisAddQueue(true);
  };

  const handleAddUserMouseUp = () => {
    setisAddQueue(false);
  };

  const handleAddUserMouseLeave = () => {
    setisAddQueue(false);
  };
  
  const handleAddUserSubmit = (userName: string) => {
    const newUserId = Date.now();
    const newUser: QueueMember = {
      maxId: newUserId,
      username: userName,
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    setIsAddUserModalOpen(false); 
  };

  const handleOpenAddUserModal = () => {
    setIsAddUserModalOpen(true);
  };

  if (!queueId) {
    return (
      <Container style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', padding: '20px' }}>
        <Typography.Title>Ошибка: ID очереди не указан</Typography.Title>
      </Container>
    );
  }

  const defaultShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  const pressedShadow = '0 0 1px rgba(0, 0, 0, 0.15)';
  const handleRemoveUser = (entryId: string) => {
    setUsers(prev => prev.filter(u => u.queueEntryId !== entryId));
  };

  const handleDeleteQueue = async (entryId: string) => {
    if (!entryId) {
      console.warn('⚠️ entryId is undefined — пропускаем удаление');
      return;
    }
    try {
      console.log('🟡 Отправляем запрос на удаление:', entryId);

      const config = createApiConfiguration();
      const queueEntriesApi = new QueueEntriesApi(config);

      await queueEntriesApi.deleteQueueEntry(entryId, authId, maxHash);

      setUsers(prevUsers => prevUsers.filter(user => user.queueEntryId!== entryId));

      console.log('✅ Пользователь удалён локально:', entryId);
    } catch (err){
      console.error('Ошибка при удалении пользователя:', err);
    }
    
  };

  useEffect(() => { 
    const config = createApiConfiguration();
    const queueApi = new QueuesApi(config);

    queueApi.getQueueMembers(queueId, authId, maxHash)
      .then(res => {
      const members: QueueMember[] = (res.data.members || []).map(
        q=> ({
            maxId: q.maxId,
            username: q.username || '',
            queueEntryId: q.queueEntryId,
        }));
        setUsers(members);
    }) 
    .catch(console.error);
  }, [queueId])

  const handleConfirmExit = async () => {
    if (selectedUserEntryId) {
      await handleDeleteQueue(selectedUserEntryId);
      setSelectedUserEntryId(null);
      setIsModalOpen(false);
    }
  };
  const MAX_CONTENT_WIDTH = '300px';
  const HORIZONTAL_PADDING = '16px';
  const handleNavigationBack = () => {
          console.log('Пользователь вернулся на предыдущий экран!');
          navigate(-1);
  };
return (
  <Container
    style={{
      backgroundColor: '#ffffffff',
      minHeight: '100vh',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Logo onBack={handleNavigationBack} />

    {/* ← ВСЁ, что ниже, будет центрировано */}
    <Flex
      direction="column"
      align="center"               // горизонтальный центр
      style={{
        width: '100%',
        maxWidth: MAX_CONTENT_WIDTH,   // 300px (у тебя уже объявлено)
        margin: '0 auto',
        padding: `0 ${HORIZONTAL_PADDING}`,
        boxSizing: 'border-box',
        gap: 12,
        flex: 1,
        paddingBottom: 100,
      }}
    >

      <Flex direction="column" align="center" style={{ width: '100%', gap: 16 }}>
        {users.map(user => (
          <SwipeableUserItem
            key={user.maxId}
            user={user}
            onDelete={handleDeleteUser}
            onConfirm={handleConfirmUser}
            onServe={handleServedUser}
            onRemove={handleRemoveUser}
          />
        ))}
      </Flex>

      {/* ---------- Кнопка «Добавить пользователя» ---------- */}
      <Flex
        align="center"
        justify="center"               // центр текста
        onClick={handleOpenAddUserModal}
        onMouseDown={handleAddUserMouseDown}
        onMouseUp={handleAddUserMouseUp}
        onMouseLeave={handleAddUserMouseLeave}
        onTouchStart={handleAddUserMouseDown}
        onTouchEnd={handleAddUserMouseUp}
        onTouchCancel={handleAddUserMouseLeave}
        style={{
          width: '100%',
          maxWidth: '240px', 
          padding: '12px 16px',
          backgroundColor: '#FFFFFF',
          border: '0.3px solid rgba(0,0,0,0.15)',
          borderRadius: 16,
          boxShadow: isAddQueue ? pressedShadow : defaultShadow,
          cursor: 'pointer',
          marginBottom: 12,
          transform: isAddQueue ? 'scale(0.98)' : 'scale(1)',
          transition: 'all 0.15s ease',
          userSelect: 'none',
        }}
      >
        <Typography.Title
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: '#333333',
            margin: 0,
          }}
        >
          Добавить пользователя
        </Typography.Title>
      </Flex>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUserSubmit}
      />
    </Flex>

    <ConfirmationModal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setSelectedUserEntryId(null);
      }}
      onConfirm={handleConfirmExit}
    />
  </Container>
);
};

export default QueueUserManagementPage;
