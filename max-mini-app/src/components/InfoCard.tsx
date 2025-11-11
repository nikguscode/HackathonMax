// src/components/InfoCard.tsx
import React from 'react';
import { Panel, Typography } from '@maxhub/max-ui'; // Используем Typography

interface InfoCardProps {
  label: string;
  value: string | number;
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value }) => {
  return (
    <Panel
      mode="secondary"
      style={{
        width: '100%', // <-- Займет ширину родителя
        maxWidth: '300px',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '12px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#F0F0F0',
      }}
    >
      <Typography.Body
        style={{
          fontSize: '16px',
          fontWeight: 400,
          color: '#000000',
          fontFamily: 'system-ui, sans-serif',
          wordBreak: 'break-word', // Добавлено для переноса длинных строк
        }}
      >
        <strong>{label}:</strong> {value}
      </Typography.Body>
    </Panel>
  );
};

export default InfoCard;