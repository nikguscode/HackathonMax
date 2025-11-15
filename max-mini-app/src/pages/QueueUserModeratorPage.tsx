import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Flex, Button, Typography, Panel } from '@maxhub/max-ui';
import AddUserModal from '../components/AddUserModal';
import AddEmployeeModal from '../components/AddEmployeeModal';
import Logo from '../components/Logo';
import { QueueMember, QueuesApi, Configuration, QueueEntriesApi, QueueStaff, StaffApi, UsersApi } from '../api';
import ConfirmationModal from '../components/ConfirmationModal';
import SkeletonQueueUserModerator from '../components/Skeletons/SkeletonQueueUserModerator';
import { showErrorToast } from '../utils/showErrorToast';

const createApiConfiguration = (): Configuration => {
  const basePath = import.meta.env.VITE_API_BASE_PATH || "http://localhost:8080/v1/api";
  const authId = sessionStorage.getItem("authId");
  const maxHash = sessionStorage.getItem("maxHash");
  const orgId = sessionStorage.getItem("orgId");

  return new Configuration({
    basePath,
    baseOptions: {
      headers: {
        ...(authId ? { authId } : {}),
        ...(maxHash ? { maxHash } : {}),
        ...(orgId ? { orgId } : {}),
      },
    },
  });
};

const QueueUserModeratorPage: React.FC = () => {
  const { id: queueId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [users, setUsers] = useState<QueueMember[]>([]);
  const [employees, setEmployees] = useState<QueueStaff[]>([]);
  const [currentView, setCurrentView] = useState<'users' | 'employees'>('users');
  const [isAddQueuePressed, setIsAddQueuePressed] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const authId = sessionStorage.getItem("authId") ?? '';
  const maxHash = sessionStorage.getItem("maxHash") ?? '';
  const orgId = sessionStorage.getItem("orgId") ?? '';

  useEffect(() => {
    if (!queueId) {
      showErrorToast({ message: "ID очереди не указан" });
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      const config = createApiConfiguration();
      const queueApi = new QueuesApi(config);
      const staffApi = new QueuesApi(config);

      try {
        setLoading(true);

        const userRes = await queueApi.getQueueMembers(queueId, authId, maxHash);
        const members: QueueMember[] = (userRes.data.members || []).map(q => ({
          maxId: q.maxId,
          username: q.username || '',
          queueEntryId: q.queueEntryId,
        }));
        setUsers(members);

 
        try {
          const staffRes = await staffApi.getQueueStaff(queueId, authId, maxHash);
          const staffMembers: QueueStaff[] = (staffRes.data.staff || []).map(q => ({
            staffId: q.staffId,
            username: q.username || '',
          }));
          setEmployees(staffMembers);
        } catch (err: any) {
          if (err.response?.status === 404) {
            setEmployees([]);
          } else {
            throw err;
          }
        }
      } catch (err: any) {
        console.error('Ошибка загрузки данных:', err);
        showErrorToast(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [queueId, authId, maxHash]);

  const handleDelete = async () => {
    if (!selectedEntryId) return;

    try {
      const config = createApiConfiguration();

      if (currentView === 'users') {
        const api = new QueueEntriesApi(config);
        await api.deleteQueueEntry(selectedEntryId, authId, maxHash);
        setUsers(prev => prev.filter(u => u.queueEntryId !== selectedEntryId));
      } else {
        const api = new StaffApi(config);
        await api.deleteStaffMember(selectedEntryId, authId, maxHash);
        setEmployees(prev => prev.filter(e => e.staffId !== selectedEntryId));
      }
    } catch (err: any) {
      console.error('Ошибка удаления:', err);
      showErrorToast(err);
    } finally {
      setSelectedEntryId(null);
      setIsModalOpen(false);
    }
  };

 
  const handleAddUser = (userName: string) => {
    const newUser: QueueMember = {
      maxId: Date.now(),
      username: userName,
      queueEntryId: `local-${Date.now()}`,
    };
    setUsers(prev => [...prev, newUser]);
    setIsAddUserModalOpen(false);
  };

 
  const handleAddEmployee = async (userId: number) => {
    try {
      const config = createApiConfiguration();
      const api = new UsersApi(config);

      await api.updateOrganizationUserRole(userId, authId, maxHash, {
        role: "EMPLOYEE",
        organizationId: orgId,
        queueId: queueId ?? '',
      });

      setEmployees(prev => [...prev, { staffId: String(userId), username: `ID ${userId}` }]);
      setIsAddEmployeeModalOpen(false);
    } catch (err: any) {
      console.error('Ошибка добавления сотрудника:', err);
      showErrorToast(err);
    }
  };

  const handleOpenAddModal = () => {
    currentView === 'users' ? setIsAddUserModalOpen(true) : setIsAddEmployeeModalOpen(true);
  };

  const handleBack = () => navigate(-1);

  const defaultShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  const pressedShadow = '0 0 1px rgba(0, 0, 0, 0.15)';
  const MAX_CONTENT_WIDTH = '300px';
  const HORIZONTAL_PADDING = '16px';

  
  if (loading) {
    return <SkeletonQueueUserModerator />;
  }

  if (!queueId) {
    return null; 
  }

  const dataToDisplay = currentView === 'users' ? users : employees;
  const addButtonText = currentView === 'users' ? 'Добавить пользователя' : 'Добавить сотрудника';

  return (
    <Container style={{ backgroundColor: '#ffffffff', minHeight: '100vh', padding: 0, display: 'flex', flexDirection: 'column' }}>
      <Logo onBack={handleBack} />

      <Flex
        direction="column"
        align="center"
        style={{
          width: '100%',
          maxWidth: MAX_CONTENT_WIDTH,
          margin: '0 auto',
          padding: `0 ${HORIZONTAL_PADDING}`,
          boxSizing: 'border-box',
          gap: '16px',
          flex: 1,
          paddingBottom: '100px',
          paddingTop: '12px',
        }}
      >
        {/* Переключатель */}
        <Flex direction="row" justify="center" style={{ width: '100%' }}>
          <Button
            mode={currentView === 'users' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('users')}
            style={{
              flex: 1,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              boxShadow: currentView === 'users' ? defaultShadow : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Пользователи
          </Button>
          <Button
            mode={currentView === 'employees' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('employees')}
            style={{
              flex: 1,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              marginLeft: '-1px',
              boxShadow: currentView === 'employees' ? defaultShadow : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Сотрудники
          </Button>
        </Flex>

        {/* Список */}
        <Flex direction="column" align="center" style={{ width: '100%', gap: '16px' }}>
          {dataToDisplay.length > 0 ? (
            dataToDisplay.map(item => {
              const isUser = currentView === 'users';
              const id = isUser ? (item as QueueMember).queueEntryId : (item as QueueStaff).staffId;
              const name = isUser ? (item as QueueMember).username : (item as QueueStaff).username;

              return (
                <Panel
                  key={id}
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
                  <Flex justify="space-between" align="center" style={{ width: '100%', gap: '10px' }}>
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
                      {name}
                    </Typography.Title>

                    <Button
                      mode="primary"
                      onClick={() => {
                        setSelectedEntryId(id!);
                        setIsModalOpen(true);
                      }}
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
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3 4H13M5.5 4V3C5.5 2.44772 5.94772 2 6.5 2H9.5C10.0523 2 10.5 2.44772 10.5 3V4M12.5 4V13C12.5 13.5523 12.0523 14 11.5 14H4.5C3.94772 14 3.5 13.5523 3.5 13V4H12.5Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6.5 7V11.5M9.5 7V11.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Button>
                  </Flex>
                </Panel>
              );
            })
          ) : (
            <Typography.Title
              style={{
                fontSize: '15px',
                fontWeight: 500,
                color: '#888888',
                margin: '20px auto',
                textAlign: 'center',
              }}
            >
              {currentView === 'users' ? 'Пользователи не найдены' : 'Сотрудники не найдены'}
            </Typography.Title>
          )}
        </Flex>

        {/* Кнопка "Добавить" */}
        <Flex
          align="center"
          justify="center"
          onClick={handleOpenAddModal}
          onMouseDown={() => setIsAddQueuePressed(true)}
          onMouseUp={() => setIsAddQueuePressed(false)}
          onMouseLeave={() => setIsAddQueuePressed(false)}
          onTouchStart={() => setIsAddQueuePressed(true)}
          onTouchEnd={() => setIsAddQueuePressed(false)}
          onTouchCancel={() => setIsAddQueuePressed(false)}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#FFFFFF',
            border: '0.3px solid rgba(0, 0, 0, 0.15)',
            borderRadius: '16px',
            boxShadow: isAddQueuePressed ? pressedShadow : defaultShadow,
            cursor: 'pointer',
            transform: isAddQueuePressed ? 'scale(0.98)' : 'scale(1)',
            transition: 'all 0.15s ease',
            userSelect: 'none',
          }}
        >
          <Typography.Title style={{ fontSize: '15px', fontWeight: 500, color: '#333333', margin: '0 auto' }}>
            {addButtonText}
          </Typography.Title>
        </Flex>
      </Flex>

      {/* Модалки */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
      />

      <AddEmployeeModal
        isOpen={isAddEmployeeModalOpen}
        onClose={() => setIsAddEmployeeModalOpen(false)}
        onAddEmployee={handleAddEmployee}
      />

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEntryId(null);
        }}
        onConfirm={handleDelete}
      />
    </Container>
  );
};

export default QueueUserModeratorPage;