// src/components/SwipeableUserItem.tsx
import React, { useState, useRef } from 'react';
import { Panel, Flex, Typography } from '@maxhub/max-ui';
import { QueueMember } from '../api';

interface SwipeableUserItemProps {
  user: QueueMember;
  onDelete: (entryId: string) => void;
  onConfirm: (entryId: string) => Promise<void>;
  onServe?: (entryId: string) => Promise<void>;
  onRemove: (entryId: string) => void;
}

const BG_WIDTH = 263;
const THRESHOLD = 50;

const SwipeableUserItem: React.FC<SwipeableUserItemProps> = ({
  user,
  onDelete,
  onConfirm,
  onServe,
  onRemove,
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const startX = useRef(0);

  const handleStart = (clientX: number) => {
    if (isAnimating) return;
    startX.current = clientX;
    setIsSwiping(true);
  };

  const handleMove = (clientX: number) => {
    if (!isSwiping || isAnimating) return;
    const diff = clientX - startX.current;
    const clamped = Math.max(-BG_WIDTH, Math.min(BG_WIDTH, diff));
    setSwipeOffset(clamped);
  };

  const handleEnd = async () => {
    if (!isSwiping || isAnimating) return;
    setIsSwiping(false);

    if (swipeOffset >= THRESHOLD) {
      setIsAnimating(true);
      setSwipeOffset(BG_WIDTH + 200);
      try {
        await onConfirm(user.queueEntryId!);
      } catch (err) {
        console.error('Ошибка при обслуживании:', err);
        setSwipeOffset(0);
        setIsAnimating(false);
      }
    } else if (swipeOffset <= -THRESHOLD) {
      onDelete(user.queueEntryId!);
      setSwipeOffset(0);
    } else {
      setSwipeOffset(0);
    }
  };

  const handleTransitionEnd = () => {
    if (isAnimating) {
      onRemove(user.queueEntryId!);
    }
  };

  const touchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const touchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };
  const touchEnd = () => handleEnd();

  const mouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const mouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const mouseUp = () => handleEnd();
  const mouseLeave = () => {
    if (isSwiping) handleEnd();
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 300,
        margin: '0 auto 8px',
        borderRadius: 12,
        overflow: 'hidden',
      }}
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
      onMouseDown={mouseDown}
      onMouseMove={isSwiping ? mouseMove : undefined}
      onMouseUp={mouseUp}
      onMouseLeave={mouseLeave}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: BG_WIDTH,
          height: '100%',
          backgroundColor: '#28A745',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 500,
          fontSize: 14,
          pointerEvents: 'none',
          transform: `translateX(${Math.min(swipeOffset, 0)}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease',
          zIndex: 0,
        }}
      >
        Обслужен
      </div>

      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: BG_WIDTH,
          height: '100%',
          backgroundColor: '#DC3545',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 500,
          fontSize: 14,
          pointerEvents: 'none',
          transform: `translateX(${Math.max(swipeOffset, 0)}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease',
          zIndex: 0,
        }}
      >
        Удалить
      </div>

 <Panel
  mode="secondary"
  style={{
    width: '99.5%',
    padding: 0, 
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    border: '0.3px solid rgba(0,0,0,0.15)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'relative',
    zIndex: 1,
    transform: `translateX(${swipeOffset}px)`,
    opacity: isAnimating ? 0 : 1,
    transition: isSwiping
      ? 'none'
      : isAnimating
      ? 'transform 0.5s ease, opacity 0.4s ease'
      : 'transform 0.3s cubic-bezier(0.25,0.8,0.25,1)',
    userSelect: 'none',
  }}
  onTransitionEnd={handleTransitionEnd}
>
  <Flex
    direction="row"
    align="center"
    justify="space-between"
    style={{
      width: '100%',
      padding: '12px 16px',
      boxSizing: 'border-box',
    }}
  >
    <Typography.Title
      style={{
        fontSize: 15,
        fontWeight: 500,
        color: '#333',
        margin: 0,
        flex: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        marginRight: 12, 
      }}
    >
      {user.username}
    </Typography.Title>

    <button
      onClick={(e) => {
        e.stopPropagation();
        onServe?.(user.queueEntryId!);
      }}
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        border: 'none',
        backgroundColor: '#0e100fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="18" height="18">
        <path d="M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1zm0 20a9 9 0 1 1 9-9 9.01 9.01 0 0 1-9 9zm.5-13h-1v6l5.25 3.15.5-.86-4.75-2.79z" />
      </svg>
    </button>
  </Flex>
</Panel>
    </div>
  );
};

export default SwipeableUserItem;