// src/components/QueueQRCode.tsx
import React from 'react';
import { Panel } from '@maxhub/max-ui';
import { QRCodeSVG } from 'qrcode.react';

interface QueueQRCodeProps {
  userId: string;
  queueId: string;
  size?: number; // Делаем размер настраиваемым
}

const QueueQRCode: React.FC<QueueQRCodeProps> = ({ userId, queueId, size = 210 }) => {
  const qrValue = React.useMemo(() => {
    return JSON.stringify({ userId, queueId });
  }, [userId, queueId]);

  return (
    <Panel
      mode="secondary"
      style={{
        // Ширина и высота теперь зависят от размера
        width: size + 40,
        height: size + 40,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        padding: '20px',
      }}
    >
      <QRCodeSVG
        value={qrValue}
        size={size} // Используем пропс
        level="M"
        includeMargin={false}
        fgColor="#000000"
        bgColor="#FFFFFF"
      />
    </Panel>
  );
};

export default QueueQRCode;