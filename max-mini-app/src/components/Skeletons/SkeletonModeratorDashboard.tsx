import React from 'react';
import { Container, Flex } from '@maxhub/max-ui';
import Logo from '../Logo';

const SkeletonBlock: React.FC<{
  width: string;
  height: string;
  borderRadius?: string;
  marginBottom?: string;
}> = ({ width, height, borderRadius = '12px', marginBottom = '0' }) => {
  const baseColor = '#EFEFEF';
  const highlightColor = '#F7F7F7';

  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        marginBottom,
        backgroundColor: baseColor,
        position: 'relative',
        overflow: 'hidden',
        transform: 'translateZ(0)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(90deg, ${baseColor} 0px, ${highlightColor} 40px, ${baseColor} 80px)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite linear',
        }}
      />
    </div>
  );
};

const SkeletonQueueCard: React.FC = () => {
  const defaultShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

  return (
    <Flex
      direction="column"
      style={{
        width: '100%',
        padding: '16px',
        backgroundColor: '#FFFFFF',
        border: '0.3px solid rgba(0, 0, 0, 0.15)',
        borderRadius: '20px',
        boxShadow: defaultShadow,
        marginBottom: '12px',
      }}
    >
      {/* Название */}
      <SkeletonBlock width="70%" height="20px" borderRadius="8px" marginBottom="12px" />

      {/* Красная линия */}
      <div style={{ width: '100%', height: '2px', backgroundColor: '#EFEFEF', margin: '8px 0 12px 0' }} />

      {/* Строки */}
      <SkeletonBlock width="85%" height="18px" borderRadius="6px" marginBottom="8px" />
      <SkeletonBlock width="75%" height="18px" borderRadius="6px" marginBottom="8px" />
      <SkeletonBlock width="80%" height="18px" borderRadius="6px" />
    </Flex>
  );
};

const SkeletonModeratorDashboard: React.FC = () => {
  const MAX_CONTENT_WIDTH = '300px';
  const HORIZONTAL_PADDING = '16px';
  const defaultShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

  return (
    <Container
      style={{
        backgroundColor: '#FFFFFFFF',
        minHeight: '100vh',
        padding: '0',
      }}
    >
      <Logo />

      <Flex
        direction="column"
        align="center"
        style={{
          width: '100%',
          maxWidth: MAX_CONTENT_WIDTH,
          margin: '0 auto',
          padding: `0 ${HORIZONTAL_PADDING} 100px ${HORIZONTAL_PADDING}`,
          boxSizing: 'border-box',
          gap: '16px',
        }}
      >
        {/* Кнопка "Организация" */}
        <Flex
          align="center"
          justify="space-between"
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#FFFFFF',
            border: '0.3px solid rgba(0, 0, 0, 0.15)',
            borderRadius: '0px',
            boxShadow: defaultShadow,
            marginBottom: '12px',
          }}
        >
          <SkeletonBlock width="65%" height="20px" borderRadius="8px" />
        </Flex>

        {/* Список очередей */}
        <Flex direction="column" align="center" style={{ width: '100%', gap: '12px' }}>
          <SkeletonQueueCard />
          <SkeletonQueueCard />
          <SkeletonQueueCard />
        </Flex>

        {/* Кнопка "Добавить очередь" */}
        <Flex
          align="center"
          justify="space-between"
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#FFFFFF',
            border: '0.3px solid rgba(0, 0, 0, 0.15)',
            borderRadius: '16px',
            boxShadow: defaultShadow,
            marginBottom: '12px',
          }}
        >
          <SkeletonBlock width="60%" height="20px" borderRadius="8px" />
        </Flex>
      </Flex>
    </Container>
  );
};

export default SkeletonModeratorDashboard;