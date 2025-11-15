// components/SkeletonQueueUserManagement.tsx
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

const SkeletonUserItem: React.FC = () => {
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
      <SkeletonBlock width="65%" height="20px" borderRadius="8px" marginBottom="12px" />

      <SkeletonBlock width="40%" height="16px" borderRadius="6px" />
    </Flex>
  );
};

const SkeletonQueueUserManagement: React.FC = () => {
  const MAX_CONTENT_WIDTH = '300px';
  const HORIZONTAL_PADDING = '16px';
  const defaultShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';

  return (
    <Container
      style={{
        backgroundColor: '#FFFFFFFF',
        minHeight: '100vh',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
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
          padding: `0 ${HORIZONTAL_PADDING}`,
          boxSizing: 'border-box',
          gap: 12,
          flex: 1,
          paddingBottom: 100,
        }}
      >
        <Flex direction="column" align="center" style={{ width: '100%', gap: 16 }}>
          <SkeletonUserItem />
          <SkeletonUserItem />
          <SkeletonUserItem />
        </Flex>

        <Flex
          align="center"
          justify="center"
          style={{
            width: '100%',
            maxWidth: '240px',
            padding: '12px 16px',
            backgroundColor: '#FFFFFF',
            border: '0.3px solid rgba(0,0,0,0.15)',
            borderRadius: 16,
            boxShadow: defaultShadow,
            marginBottom: 12,
          }}
        >
          <SkeletonBlock width="70%" height="20px" borderRadius="8px" />
        </Flex>
      </Flex>
    </Container>
  );
};

export default SkeletonQueueUserManagement;