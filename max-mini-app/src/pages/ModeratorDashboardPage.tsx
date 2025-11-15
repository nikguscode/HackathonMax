import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Flex, Typography } from '@maxhub/max-ui';
import Logo from '../components/Logo';
import AddQueueModal from '../components/AddQueueModal';
import { OrganizationsApi, Configuration, Queue } from '../api';
import axios from 'axios';
import SkeletonModeratorDashboard from '../components/Skeletons/SkeletonModeratorDashboard';
import { showErrorToast } from '../utils/showErrorToast';

interface QueueCardProps {
  id: string,
  name: string,
  employeeCount?: number,
  currentQueue?: number,
  totalServed?: number,
  onClick?: () => void;
}

const QueueCard: React.FC<QueueCardProps> = ({ name, employeeCount, currentQueue, totalServed, onClick }) => {
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
          margin: '0',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}
      >
        {name}
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
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          }}
        >
          Количество сотрудников: {employeeCount}
        </Typography.Body>
        <Typography.Body
          style={{
            fontSize: '14px',
            color: '#000000',
            margin: 0,
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          }}
        >
          Максимум человек: {currentQueue}
        </Typography.Body>
        <Typography.Body
          style={{
            fontSize: '14px',
            color: '#000000',
            margin: 0,
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          }}
        >
          Всего людей обслужено: {totalServed}
        </Typography.Body>
      </Flex>
    </Flex>
  );
};

const createApiConfiguration = (): Configuration => {
  const basePath =
    import.meta.env.VITE_API_BASE_PATH || "http://localhost:8080/v1/api";

  const authId = sessionStorage.getItem("authId");
  const maxHash = sessionStorage.getItem("maxHash");

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

const ModeratorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModeratorButtonPressed, setIsModeratorButtonPressed] = useState(false);
  const [isAddQueue, setisAddQueue] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id: orgId } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queues, setQueues] = useState<Queue[]>([]);
  const [orgName, setOrgName] = useState<string | null>(null);

  const authId = sessionStorage.getItem("authId") ?? '';
  const maxHash = sessionStorage.getItem("maxHash") ?? '';
  sessionStorage.setItem("orgId", orgId ?? '');

  const fetchQueues = async (organizationId: string) => {
        if (!orgId) {
          showErrorToast({ message: "ID организации не указан" });
          setLoading(false);
          return;
        }
        try {
            setLoading(true);

            const apiConfig = createApiConfiguration();
            const organizationsApi = new OrganizationsApi(apiConfig, apiConfig.basePath, axios);

            const queuesResponse = await organizationsApi.getOrganizationQueues(
                organizationId, 
                authId, 
                maxHash
            );
            
            const queueList = queuesResponse.data.queues || [];
            const organizationName = queuesResponse.data.organizationName ?? '';

            setOrgName(organizationName);
            
            const newQueues: Queue[] = queueList.map(queue => ({
                id: queue.id,
                name: queue.name,
                amountOfEmployees: queue.amountOfEmployees,
                amountOfServedPeople: queue.amountOfServedPeople,
            }));
            
            setQueues(newQueues);
            return true; 
        } catch (err) {
            console.error('Ошибка загрузки данных организации:', err);
            showErrorToast('Ошибка при загрузке данных организации.');
            return false; 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!orgId) return;
        fetchQueues(orgId);
    }, [orgId]);


  const handleQueueClick = (queueId: string) => {
    navigate(`/moderator-queue/${queueId}`);
  };

  const handleAddQueue = () => {
    setIsModalOpen(true);
    console.log('Добавить очередь');
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const handleAddQueueSubmit = async (
      queueName: string, 
      arrivalGracePeriod?: number, 
      maxQueueSize?: number
  ) => {
      if (!orgId) return;

      const apiConfig = createApiConfiguration();
      const queuesApi = new OrganizationsApi(apiConfig, apiConfig.basePath, axios);

      const queueData = {
          name: queueName,
          ...(arrivalGracePeriod !== undefined && { arrivalGracePeriod }),
          ...(maxQueueSize !== undefined && { maxQueueSize }),
      };

      try {
          await queuesApi.createOrganizationQueue(
              orgId, 
              authId, 
              maxHash, 
              queueData 
          );

          handleCloseModal();

          await fetchQueues(orgId);
      } catch (err) {
          console.error('Ошибка при добавлении очереди:', err);
          alert('Не удалось добавить очередь');
      }
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
    navigate(`/organization/${orgId}`);
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

  if (loading) return <SkeletonModeratorDashboard/>;
  return (
    <Container
      style={{
        backgroundColor: '#ffffffff',
        minHeight: '100vh',
        padding: '0',
      }}
    >
      <Logo />

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
              overflow: 'hidden',      
              whiteSpace: 'nowrap',    
              textOverflow: 'ellipsis',
            }}
          >
            {orgName}
          </Typography.Title>
        </Flex>

        <Flex direction="column" align="center" style={{ width: '100%', gap: '12px' }}>
          {queues.map((queue: Queue) => (
            <QueueCard
              key={queue.id}
              name={queue.name ?? ''}
              employeeCount= {queue.amountOfEmployees}
              currentQueue= {queue.maxSizeOfTodayQueue}
              id= {queue.id ?? ''}
              totalServed={queue.amountOfServedPeople}

              onClick={() => handleQueueClick(queue.id ?? '')}
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
      <AddQueueModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddQueue={handleAddQueueSubmit}
        orgId={orgId ?? ''}
      />
    </Container>
  );
};

export default ModeratorDashboardPage;

