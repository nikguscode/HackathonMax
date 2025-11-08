import React from 'react';
import { Container, Flex } from '@maxhub/max-ui';
import { useParams } from 'react-router-dom';
import logo from '/logo.jpg'; 
import QueueManagmentButton from '../components/QueueManagmentButton';

interface QueueToManage {
    id: string;
    name: string;
}

const getMockQueues = (orgId: string): QueueToManage[] => {
  if (orgId === 'org1') {
    return [
      { id: 'q1', name: 'Очередь 1' },
      { id: 'q2', name: 'Очередь 2' },
      { id: 'q3', name: 'Очередь 3' },
    ];
  } else if (orgId === 'org2') {
    return [
      { id: 'q4', name: 'Очередь 1' },
    ];
  }
  return [];
};

const QueueManagementPage: React.FC = () => {
    const { id: orgId } = useParams<{ id: string }>();

    const MAX_CONTENT_WIDTH = '300px'; 
    const HORIZONTAL_PADDING = '16px'; 
    
    const mockManagedQueues = React.useMemo(() => {
        if (!orgId) return [];
        return getMockQueues(orgId);
    }, [orgId]);
    
    if (!orgId) {   
        return (
            <Container style={{ backgroundColor: '#E5E5E5', minHeight: '100vh', padding: '20px' }}>
                <div>Ошибка: ID организации не указан</div>
            </Container>
        );
    }

    return (
        <Container
            style={{ 
                backgroundColor: '#ffffffff', 
                minHeight: '100vh',
                padding: '0',
            }}
        >
            <Flex justify="center" align="center" style={{ padding: '0px 0 0px 0' }}>
                <img 
                    src={logo} 
                    alt="Logo" 
                    style={{ 
                        maxWidth: '300px',
                        height: 'auto',
                        objectFit: 'contain'
                    }} 
                />
            </Flex>

            <Flex
                direction="column"
                align="center"
                style={{
                    width: '100%',
                    maxWidth: MAX_CONTENT_WIDTH,
                    margin: '0 auto', 
                    padding: `20px ${HORIZONTAL_PADDING}`,
                    boxSizing: 'border-box',
                    gap: '12px', 
                }}
            >
                    <div style={{ width: '300px' }}>
                        {mockManagedQueues.length > 0 && (
                            <Flex direction="column" align="center">
                               { mockManagedQueues.map((queue) => (
                                    <QueueManagmentButton 
                                        key={queue.id}
                                        name={queue.name}
                                        queueId={queue.id}
                                    />
                                ))}
                            </Flex>
                        )}
                    </div>
                </Flex>
        </Container>
    );
};

export default QueueManagementPage;