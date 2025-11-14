import { useState } from 'react';
import type { FC } from 'react';
import { Flex, Typography } from '@maxhub/max-ui';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Вы уверены?"
}) => {
  const [isYesPressed, setIsYesPressed] = useState(false);
  const [isNoPressed, setIsNoPressed] = useState(false);

  if (!isOpen) return null;

  const defaultShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  const pressedShadow = '0 0 1px rgba(0, 0, 0, 0.15)';
  const blockColor = '#F7F7F7';

  return (
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
        <Flex
          align="center"
          justify="center"
          style={{
            width: 'calc(100% - 32px)',
            padding: '12px 16px',
            backgroundColor: blockColor,
            border: '0.3px solid rgba(0, 0, 0, 0.15)',
            borderRadius: '16px',
            fontSize: '15px',
            color: '#333333',
            marginBottom: '20px',
            minHeight: '50px',
          }}
        >
          <Typography.Title
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#333333',
              margin: '0',
              textAlign: 'center',
            }}
          >
            {title}
          </Typography.Title>
        </Flex>

        <Flex justify="space-between" gap={10} style={{ width: '100%' }}>
          <Flex
            align="center"
            justify="center"
            onClick={onConfirm}
            onMouseDown={() => setIsYesPressed(true)}
            onMouseUp={() => setIsYesPressed(false)}
            onMouseLeave={() => setIsYesPressed(false)}
            onTouchStart={() => setIsYesPressed(true)}
            onTouchEnd={() => setIsYesPressed(false)}
            onTouchCancel={() => setIsYesPressed(false)}
            style={{
              flex: 1, 
              padding: '12px 16px',
              backgroundColor: '#FFFFFF',
              border: '0.3px solid rgba(0, 0, 0, 0.15)',
              borderRadius: '16px',
              boxShadow: isYesPressed ? pressedShadow : defaultShadow,
              cursor: 'pointer',
              transform: isYesPressed ? 'scale(0.98)' : 'scale(1)',
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
              Да
            </Typography.Title>
          </Flex>

          <Flex
            align="center"
            justify="center"
            onClick={onClose}
            onMouseDown={() => setIsNoPressed(true)}
            onMouseUp={() => setIsNoPressed(false)}
            onMouseLeave={() => setIsNoPressed(false)}
            onTouchStart={() => setIsNoPressed(true)}
            onTouchEnd={() => setIsNoPressed(false)}
            onTouchCancel={() => setIsNoPressed(false)}
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: '#FFFFFF',
              border: '0.3px solid rgba(0, 0, 0, 0.15)',
              borderRadius: '16px',
              boxShadow: isNoPressed ? pressedShadow : defaultShadow,
              cursor: 'pointer',
              transform: isNoPressed ? 'scale(0.98)' : 'scale(1)',
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
              Нет
            </Typography.Title>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ConfirmationModal;