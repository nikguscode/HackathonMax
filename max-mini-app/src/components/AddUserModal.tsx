import React, { useState } from 'react';
import { Flex, Typography } from '@maxhub/max-ui';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userName: string) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser }) => {
  const [userName, setUserName] = useState('');
  const [isAddingPressed, setIsAddingPressed] = useState(false);

  if (!isOpen) return null;

  const defaultShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  const pressedShadow = '0 0 1px rgba(0, 0, 0, 0.15)';

  const handleAddClick = () => {
    if (userName.trim()) {
      onAddUser(userName.trim());
      setUserName(''); // Сброс поля
    }
  };

  return (
    // Задний фон (Оверлей)
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
      onClick={onClose}
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
        onClick={(e) => e.stopPropagation()}
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
          Добавить пользователя
        </Typography.Title>

        {/* Поле для ввода имени пользователя */}
        <input
          type="text"
          placeholder="Имя пользователя"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{
            width: 'calc(100% - 32px)',
            padding: '12px 16px',
            backgroundColor: '#F7F7F7',
            border: '0.3px solid rgba(0, 0, 0, 0.15)',
            borderRadius: '16px',
            fontSize: '15px',
            color: '#333333',
            marginBottom: '16px',
            outline: 'none',
          }}
        />

        {/* Мы убрали второе поле "Параметры", так как нужно только имя */}

        {/* Кнопка "Добавить пользователя" */}
        <Flex
          align="center"
          justify="center"
          onClick={handleAddClick}
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
              margin: '0',
            }}
          >
            Добавить
          </Typography.Title>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AddUserModal;