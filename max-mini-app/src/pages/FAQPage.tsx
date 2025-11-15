import React, { useState } from 'react';
import { Typography, Flex, Container, Panel } from '@maxhub/max-ui';
import Logo from '../components/Logo';

interface FAQItemData {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItemData[] = [
  {
    id: 1,
    question: 'Как управлять пользователями в очереди?',
    answer: 'Для управления пользователями перейдите в раздел "Управление очередью", выберите нужную очередь и используйте кнопки "Добавить" или "Удалить" рядом с каждым участником. Доступно только модераторам.',
  },
  {
    id: 2,
    question: 'Где находятся настройки организации?',
    answer: 'Настройки организации доступны через основную панель модератора. Вы можете изменить название, логотип и основные параметры в разделе "Параметры организации".',
  },
  {
    id: 3,
    question: 'Можно ли увидеть статистику по активности очереди?',
    answer: 'Да, детальная статистика по активности, времени ожидания и количеству обслуженных пользователей доступна на странице организации. Данные обновляются в режиме реального времени.',
  },
  {
    id: 4,
    question: 'Как добавить новую очередь?',
    answer: 'Новая очередь создается через вкладку "Управление очередями", нажатием на кнопку "Добавить очередь". Вам потребуется ввести название, описание и выбрать модераторов.',
  },
  {
    id: 5,
    question: 'Что произойдет, если я покину организацию?',
    answer: 'Если вы покинете организацию, вы потеряете доступ ко всем очередям и данным этой организации. Вся ваша история в очередях будет сохранена, но станет недоступна вам.',
  },
];

interface FAQItemProps {
  item: FAQItemData;
}

const FAQItem: React.FC<FAQItemProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const defaultShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  const pressedShadow = '0 0 1px rgba(0, 0, 0, 0.15)';
  const [isPress, setIsPress] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    console.log('Добавить очередь');
  };
  
  const handleMouseDown = () => setIsPress(true);
  const handleMouseUp = () => setIsPress(false);
  const handleMouseLeave = () => setIsPress(false);

  return (
    <Panel
      mode="secondary"
      style={{
        width: '100%',
        padding: '0',
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        border: '0.3px solid rgba(0, 0, 0, 0.15)',
        boxShadow: defaultShadow,
        transition: 'box-shadow 0.15s ease',
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        onClick={handleToggle}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          padding: '16px',
          cursor: 'pointer',
          borderBottom: isOpen ? '1px solid #E0E0E0' : 'none',
          backgroundColor: isPress ? '#FAFAFA' : '#FFFFFF',
          borderRadius: isOpen ? '12px 12px 0 0' : '12px',
          boxShadow: isPress ? pressedShadow : 'none',
          transform: isPress ? 'scale(0.995)' : 'scale(1)',
          transition: 'all 0.1s ease',
          userSelect: 'none',
        }}
      >
        <Typography.Title
          style={{
            fontSize: '15px',
            fontWeight: 500,
            color: '#333333',
            margin: 0,
            flexGrow: 1,
            textAlign: 'left',
          }}
        >
          {item.question}
        </Typography.Title>
        
        <div style={{ 
          marginLeft: '10px',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
          display: 'flex', 
          alignItems: 'center',
          color: '#555555'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </Flex>
      
      {isOpen && (
        <Flex
          direction="column"
          style={{
            padding: '16px',
            backgroundColor: '#F7F7F7',
            borderRadius: '0 0 12px 12px',
          }}
        >
          <Typography.Body
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#555555',
              margin: 0,
              textAlign: 'left',
            }}
          >
            {item.answer}
          </Typography.Body>
        </Flex>
      )}
    </Panel>
  );
};

const FAQPage: React.FC = () => {
  const MAX_CONTENT_WIDTH = '350px';
  const HORIZONTAL_PADDING = '16px';

  return (
    <Container
      style={{
        backgroundColor: '#FFFFFF',
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
          border: '0.3px solid rgba(0, 0, 0, 0.15)',
          borderRadius: "25px",
          margin: '0 auto',
          padding: `20px ${HORIZONTAL_PADDING} 30px ${HORIZONTAL_PADDING}`,
          boxSizing: 'border-box',
          gap: '24px',
        }}
      >
        <Typography.Title
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#333333',
            margin: 0,
            textAlign: 'center',
            width: '100%',
          }}
        >
          Часто задаваемые вопросы
        </Typography.Title>
        
        <Flex direction="column" style={{ width: '100%', gap: '10px' }}>
          {faqData.map(item => (
            <FAQItem key={item.id} item={item} />
          ))}
        </Flex>

        <Typography.Body
          style={{
            fontSize: '12px',
            color: '#AAAAAA',
            marginTop: '10px',
            textAlign: 'center',
          }}
        >
          Если вы не нашли ответа на свой вопрос, обратитесь в службу поддержки.
        </Typography.Body>
        
      </Flex>
    </Container>
  );
};

export default FAQPage;