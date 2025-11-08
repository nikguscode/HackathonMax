import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Typography } from '@maxhub/max-ui';

interface QueueCardProps {
  name: string;
  count: number;
  queueId: string;
  onClick?: () => void;
}

const QueueCard: React.FC<QueueCardProps> = ({ name, count, queueId, onClick }) => {
  const navigate = useNavigate();
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

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/queue/${queueId}`);
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
        borderRadius: '50px',
        border: '0.3px solid rgba(0, 0, 0, 0.15)',
        boxShadow: isPressed ? pressedShadow : defaultShadow,
        cursor: onClick ? 'pointer' : 'default',
        marginBottom: '12px',
        transform: isPressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'all 0.1s ease',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
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

      <div
        style={{
          backgroundColor: '#6A5ACD', 
          color: '#FFFFFF',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 600,
          minWidth: '20px', 
          textAlign: 'center',
          pointerEvents: 'none',
          boxShadow: '0 2px 4px #6A5ACD', 
        }}
      >
        {count}
      </div>
    </Flex>
  );
};

export default QueueCard;