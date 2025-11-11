// src/components/QRCodeModal.tsx
import React from 'react';
import QueueQRCode from './QueueQRcode';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  queueId: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, userId, queueId }) => {
  if (!isOpen) {
    return null; // Не рендерим ничего, если закрыто
  }

  return (
    <div
      onClick={onClose} // Закрытие по клику на фон
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
      {/* Останавливаем всплытие, чтобы клик по QR-коду 
        не закрывал модальное окно 
      */}
      <div onClick={(e) => e.stopPropagation()}>
        <QueueQRCode userId={userId} queueId={queueId} size={250} />
      </div>
    </div>
  );
};

export default QRCodeModal;