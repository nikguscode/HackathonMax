import React, { useState } from 'react';
import { Flex, Typography } from '@maxhub/max-ui';

interface AddQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQueue: (queueName: string) => void;
  orgId: string; // ID организации, для которой создается очередь
}

const AddQueueModal: React.FC<AddQueueModalProps> = ({ isOpen, onClose, onAddQueue, orgId }) => {
  const [queueName, setQueueName] = useState('');
  const [isAddingPressed, setIsAddingPressed] = useState(false); // Состояние для кнопки "Добавить очередь" в модалке

  if (!isOpen) return null;

  const defaultShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  const pressedShadow = '0 0 1px rgba(0, 0, 0, 0.15)';

  const handleAddQueue = () => {
    if (queueName.trim()) {
      onAddQueue(queueName.trim());
      setQueueName(''); // Сброс поля после добавления
    }
  };

  return (
    // Задний фон модального окна
    <Flex
      justify="center"
      align="center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose} // Закрыть модалку при клике на фон
    >
      {/* Контент модального окна */}
      <Flex
        direction="column"
        align="center"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px 20px',
          width: '100%',
          maxWidth: '300px',
          boxShadow: defaultShadow,
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()} // Предотвратить закрытие при клике на сам контент
      >
        <Typography.Title
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#333333',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          Создать новую очередь
        </Typography.Title>

        {/* Поле для ввода названия очереди */}
        <input
          type="text"
          placeholder="Название очереди"
          value={queueName}
          onChange={(e) => setQueueName(e.target.value)}
          style={{
            width: 'calc(100% - 32px)', // Ширина минус padding
            padding: '12px 16px',
            backgroundColor: '#F7F7F7', // Светло-серый фон
            border: '0.3px solid rgba(0, 0, 0, 0.15)',
            borderRadius: '16px', // Закругленные края как на карточках
            fontSize: '15px',
            color: '#333333',
            marginBottom: '16px',
            outline: 'none', // Убираем стандартную обводку при фокусе
          }}
        />

        {/* Параметры очереди (заглушка) */}
        {/* <Flex
          direction="column"
          justify="center"
          align="center"
          style={{
            width: 'calc(100% - 32px)',
            padding: '16px',
            backgroundColor: '#F7F7F7',
            border: '0.3px solid rgba(0, 0, 0, 0.15)',
            borderRadius: '16px',
            boxShadow: defaultShadow,
            marginBottom: '20px',
            minHeight: '80px', // Для визуального соответствия
            textAlign: 'center',
          }}
        >
          <Typography.Body
            style={{
              fontSize: '14px',
              color: '#666666',
            }}
          >
            Какие-то параметры очереди, которые определим потом
          </Typography.Body>
        </Flex> */}
        <input
          type="text"
          placeholder="Какие-то параметры очереди, которые определим потом"
          value={queueName}
          onChange={(e) => setQueueName(e.target.value)}
          style={{
            width: 'calc(100% - 32px)', // Ширина минус padding
            padding: '12px 16px',
            backgroundColor: '#F7F7F7', // Светло-серый фон
            border: '0.3px solid rgba(0, 0, 0, 0.15)',
            borderRadius: '16px', // Закругленные края как на карточках
            fontSize: '15px',
            color: '#333333',
            marginBottom: '16px',
            outline: 'none', // Убираем стандартную обводку при фокусе
          }}
        />

        {/* Кнопка "Добавить очередь" */}
        <Flex
          align="center"
          justify="center" // Центрируем текст
          onClick={handleAddQueue}
          onMouseDown={() => setIsAddingPressed(true)}
          onMouseUp={() => setIsAddingPressed(false)}
          onMouseLeave={() => setIsAddingPressed(false)}
          onTouchStart={() => setIsAddingPressed(true)}
          onTouchEnd={() => setIsAddingPressed(false)}
          onTouchCancel={() => setIsAddingPressed(false)}
          style={{
            width: 'calc(100% - 32px)',
            padding: '12px 16px',
            backgroundColor: '#FFFFFF',
            border: '0.3px solid rgba(0, 0, 0, 0.15)',
            borderRadius: '16px',
            boxShadow: isAddingPressed ? pressedShadow : defaultShadow,
            cursor: 'pointer',
            transform: isAddingPressed ? 'scale(0.98)' : 'scale(1)',
            transition: 'all 0.15s ease',
            userSelect: 'none',
          }}
        >
          <Typography.Title
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: '#333333',
              margin: '0', // Убираем margin: '0 auto' для Flex justify="center"
            }}
          >
            Добавить очередь
          </Typography.Title>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AddQueueModal;