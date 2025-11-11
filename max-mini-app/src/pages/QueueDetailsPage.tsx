import React, {useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Flex, Typography, Panel } from '@maxhub/max-ui';
import { QRCodeSVG } from 'qrcode.react';
import Logo from '../components/Logo';
import ConfirmationModal from '../components/ConfirmationModal';
import { QueueEntryResponse, QueueEntriesApi, Configuration } from '../api';

const createApiConfiguration = (): Configuration => {
  const basePath =
    import.meta.env.VITE_API_BASE_PATH || "http://localhost:8080/v1/api";
  return new Configuration({
    basePath,
  });
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
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        
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
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
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
  const { id: entryId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [queueDetails, setQueueDetails] = useState<QueueEntryResponse | null>(null);
  const [isExitQueue, setisExitQueue] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);

  useEffect(() => { 
    if (!entryId) return;
    const fetchQueueEntry = async () => {
    
      try{
        const config = createApiConfiguration();
        const userInfoApi = new QueueEntriesApi(config);

        const response = await userInfoApi.getQueueEntry(entryId);
        setQueueDetails(response.data);
        
        console.log('Ответ API:', response.data);
        
      } catch (err) {
        console.error('Ошибка при получении информации о пользователе:', err);
      }
    }
    fetchQueueEntry();
  }, [entryId]);

  const handleDeleteQueue = async () => {
    if (!entryId) return;

    try {
      const config = createApiConfiguration();
      const queueApi = new QueueEntriesApi(config);

      await queueApi.deleteQueueEntry(entryId);
      console.log('Очередь успешно удалена:', entryId);

      navigate('/');
    } catch (err) {
      console.error('Ошибка при удалении очереди:', err);
    }
  };

  if (!queueDetails) {
  return <div>Загрузка данных о пользователе...</div>;
  }

  const defaultShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
  const pressedShadow = '0 0 1px rgba(0, 0, 0, 0.15)';

  if (!entryId) {
    return (
      <Container>
        <div>Ошибка: ID очереди не указан</div>
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
  
  const handleConfirmExit = async () => {
    await handleDeleteQueue();
    setIsModalOpen(false);
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
      <Logo/>

      <Flex direction="column" align="center" justify="center" style={{ width: '100%' }}>
          <Flex direction="column" align="center" justify="center">
            <InfoCard
              label="Название очереди"
              value={queueDetails?.name ?? 'Неизвестно'}
            />
            <InfoCard
              label="Логин"
              value={queueDetails?.login ?? 'Неизвестно'}
            />
            <InfoCard
              label="Позиция в очереди"
              value={queueDetails?.peopleInFront ?? 'Неизвестно'}
            />
            <InfoCard
              label="Статус очереди"
              value={queueDetails?.status ?? 'Неизвестно'}
            />
          </Flex>

          <Flex justify="center" align="center">
            <div onClick={() => setIsQRCodeOpen(true)} style={{ cursor: 'pointer' }}> 
              <QRCode userId={entryId} queueId={entryId} />
            </div>
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
              width: 'auto',
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
              Выйти из очереди
            </Typography.Title>
          </Flex>
      </Flex>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmExit}
      />
      {isQRCodeOpen && (
      <div
        onClick={() => setIsQRCodeOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          cursor: 'pointer',
        }}
      >
        <Panel
          mode="secondary"
          style={{
            width: '270px',
            height: '270px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 5px 15px rgba(235, 235, 235, 1)',
            borderRadius: '16px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <QRCodeSVG
            value={JSON.stringify({ userId: entryId, queueId: entryId })}
            size={250}
            level="M"
            includeMargin={false}
            fgColor="#000000"
            bgColor="#FFFFFF"
          />
        </Panel>
      </div>
    )}
    </Container>
  );
};

export default QueueDetailsPage;

