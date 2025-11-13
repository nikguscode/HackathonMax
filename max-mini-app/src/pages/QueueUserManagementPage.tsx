import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Flex, Button, Typography, Panel } from '@maxhub/max-ui';
import AddUserModal from '../components/AddUserModal';
import Logo from '../components/Logo';
import { QueueMember, QueuesApi, Configuration, QueueEntriesApi } from '../api';
import ConfirmationModal from '../components/ConfirmationModal';


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
  const { id: queueId } = useParams<{ id: string }>();
  const [users, setUsers] = useState<QueueMember[]>([]);
  const [isAddQueue, setisAddQueue] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserEntryId, setSelectedUserEntryId] = useState<string | null>(null);

  const authId = localStorage.getItem("authId") ?? '';
  const maxHash = localStorage.getItem("maxHash") ?? '';

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
      <Logo />
      <Flex
        direction="column"
        align="center"
        style={{
          width: '100%',
          maxWidth: MAX_CONTENT_WIDTH,
          height: 'auto',
          margin: '0 auto',
          padding: `0px ${HORIZONTAL_PADDING}`,
          boxSizing: 'border-box',
          gap: '12px',
          flex: 1,
          paddingBottom: '100px',
        }}
      >
        <Flex direction="column" align="center" style={{ width: '100%', gap: '16px', marginBottom: '12px'  }}>
          {users.map((user) => (
            <Panel
              key={user.maxId}
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
              <Flex
                    justify="space-between"
                    align="center"
                    style={{
                      width: '100%',
                      gap: '10px',
                    }}
                  >
                  <Typography.Title
                    style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      color: '#333333',
                      margin: 0,
                      flexGrow: 1,           
                      flexShrink: 1,           
                      minWidth: 0,             
                      overflow: 'hidden',      
                      whiteSpace: 'nowrap',    
                      textOverflow: 'ellipsis',
                      textAlign: 'left',
                    }}
                  >
                    {user.username}
                  </Typography.Title>
                
              <Button
                mode="primary"
                onClick={() => handleDeleteUser(user.queueEntryId!)}
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
                  marginLeft: '2%',
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
        <Flex
          align="center"
          justify="space-between"
          onClick={handleOpenAddUserModal}
          onMouseDown={handleAddUserMouseDown}
          onMouseUp={handleAddUserMouseUp}
          onMouseLeave={handleAddUserMouseLeave}
          onTouchStart={handleAddUserMouseDown}
          onTouchEnd={handleAddUserMouseUp}
          onTouchCancel={handleAddUserMouseLeave}
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
        onClose={() => { setIsModalOpen(false); setSelectedUserEntryId(null); }}
        onConfirm={handleConfirmExit}
      />
    </Container>
  );
};

export default QueueUserManagementPage;

