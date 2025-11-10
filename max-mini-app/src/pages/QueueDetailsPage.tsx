import React, {useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Flex, Typography, Panel } from '@maxhub/max-ui';
import { QRCodeSVG } from 'qrcode.react';
import logo from '/logo.jpg';
import ConfirmationModal from '../components/ConfirmationModal';

interface QueueDetails {
  id: string;
  name: string;
  uniqueId: string;
  position: number;
  employeeName: string;
  userId: string;
}

const getQueueDetails = (queueId: string): Omit<QueueDetails, 'userId'> | null => {
  return {
    id: queueId,
    name: 'Буфет "Сигма"',
    uniqueId: queueId,
    position: 32,
    employeeName: 'dqwdqw',
  };
};

interface InfoCardProps {
  label: string;
  value: string | number;
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value }) => {
  return (
    <Panel
      mode="secondary"
      style={{
        minWidth: '300px',
        maxWidth: '300px',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '12px',
        
        backgroundColor: '#F0F0F0',
      }}
    >
      <span
        style={{
          fontSize: '16px',
          fontWeight: 400,
          color: '#000000',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {label}: {value}
      </span>
    </Panel>
  );
};

interface QRCodeProps {
  userId: string;
  queueId: string;
}

const QRCode: React.FC<QRCodeProps> = ({ userId, queueId }) => {
  const qrValue = React.useMemo(() => {
    return JSON.stringify({
      userId,
      queueId,
    });
  }, [userId, queueId]);

  return (
    <Panel
      mode="secondary"
      style={{
        width: '250px',
        height: '250px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginTop: '24px',
        marginBottom: '24px',
        padding: '20px',
      }}
    >
      <QRCodeSVG
        value={qrValue}
        size={210}
        level="M"
        includeMargin={false}
        fgColor="#000000"
        bgColor="#FFFFFF"
      />
    </Panel>
  );
};

const QueueDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isExitQueue, setisExitQueue] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  const pressedShadow = '0 0 1px rgba(0, 0, 0, 0.15)';

  const userId = React.useMemo(() => {
    if (!id) return '';
    const seed = id.split('').reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);
    const randomStr = Math.sin(seed).toString(36).substring(2, 11);
    return `user_${randomStr}`;
  }, [id]);

  if (!id) {
    return (
      <Container>
        <div>Ошибка: ID очереди не указан</div>
      </Container>
    );
  }

  const baseQueueDetails = getQueueDetails(id);
  
  const queueDetails = React.useMemo(() => {
    if (!baseQueueDetails) return null;
    return {
      ...baseQueueDetails,
      userId,
    };
  }, [baseQueueDetails, userId]);

  if (!queueDetails) {
    return (
      <Container>
        <div>Очередь не найдена</div>
      </Container>
    );
  }

  const handleExitQueue = () => {
    setIsModalOpen(true);
  };

  const handleExitQueueMouseDown = () => {
    setisExitQueue(true);
  };

  const handleExitQueueMouseUp = () => {
    setisExitQueue(false);
  };

  const handleExitQueueMouseLeave = () => {
    setisExitQueue(false);
  };
  
  const handleConfirmExit = () => {
    console.log('Выход из очереди:', queueDetails.id);
    setIsModalOpen(false);
    navigate('/');
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container
      style={{
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        padding: '0',
      }}
    >
      <Flex justify="center" align="center" style={{ marginBottom: '24px' }}>
        <img
          src={logo}
          alt="Logo"
          style={{
            width: '300px',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </Flex>

      <Flex direction="column" align="center" justify="center" style={{ width: '100%' }}>
          <Flex direction="column" align="center" justify="center">
            <InfoCard
              label="Название очереди"
              value={queueDetails.name}
            />
            <InfoCard
              label="Уникальный идентификатор"
              value={queueDetails.uniqueId}
            />
            <InfoCard
              label="Позиция в очереди"
              value={queueDetails.position}
            />
            <InfoCard
              label="Имя сотрудника"
              value={queueDetails.employeeName}
            />
          </Flex>

          <Flex justify="center" align="center">
            <QRCode userId={queueDetails.userId} queueId={queueDetails.id} />
          </Flex>

          <Flex
            align="center"
            justify="space-between"
            onClick={handleExitQueue}
            onMouseDown={handleExitQueueMouseDown}
            onMouseUp={handleExitQueueMouseUp}
            onMouseLeave={handleExitQueueMouseLeave}
            onTouchStart={handleExitQueueMouseDown}
            onTouchEnd={handleExitQueueMouseUp}
            onTouchCancel={handleExitQueueMouseLeave}
            style={{
              width: '20%',
              minWidth: '300px',
              padding: '12px 16px',
              backgroundColor: '#aa1818ff',
              border: '0.3px solid rgba(0, 0, 0, 0.15)',
              borderRadius: '16px',
              boxShadow: isExitQueue ? pressedShadow : defaultShadow,
              cursor: 'pointer',
              marginBottom: '12px',
              transform: isExitQueue ? 'scale(0.98)' : 'scale(1)',
              transition: 'all 0.15s ease',
              userSelect: 'none',
            }}
          >
            <Typography.Title
              
              style={{
                fontSize: '15px',
                fontWeight: 500,
                color: '#ffffffff',
                margin: '0 auto',
              }}
            >
              Добавить очередь
            </Typography.Title>
          </Flex>
      </Flex>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmExit}
      />
    </Container>
  );
};

export default QueueDetailsPage;

