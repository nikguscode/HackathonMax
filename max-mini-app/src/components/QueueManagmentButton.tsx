import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Typography } from '@maxhub/max-ui';

interface QueueCardProps {
  name: string;
  queueId: string;
  onClick?: () => void;
}

const QueueManagmentButton: React.FC<QueueCardProps> = ({ name, queueId, onClick }) => {
  const [isPressed, setIsPressed] = useState(false);
  const navigate = useNavigate();

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/managment/queue/${queueId}`);
    }
  };

  const defaultShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

  const pressedShadow = '0 0 1px rgba(0, 0, 0, 0.15)';

  return (
    <Flex
      align="center"
      justify="space-between"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchCancel={handleMouseLeave}
      style={{
        width: '100%',
        padding: '12px 16px',
        backgroundColor: '#FFFFFF',
        border: '0.3px solid rgba(0, 0, 0, 0.15)',
        borderRadius: '0px',
        boxShadow: isPressed ? pressedShadow : defaultShadow,
        cursor: 'pointer',
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
          margin: 0,
        }}
      >
        {name}
      </Typography.Title>
    </Flex>
  );
};

export default QueueManagmentButton;