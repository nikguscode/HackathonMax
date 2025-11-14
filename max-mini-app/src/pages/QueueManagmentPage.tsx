import React, {useState, useEffect} from 'react';
import { Container, Flex } from '@maxhub/max-ui';
import { useParams } from 'react-router-dom';
import Logo from '../components/Logo';
import QueueManagmentButton from '../components/QueueManagmentButton';
import { OrganizationsApi, Configuration, SimpleQueue } from '../api';


const createApiConfiguration = (): Configuration => {
  const basePath =
    import.meta.env.VITE_API_BASE_PATH || "http://localhost:8080/v1/api";

  const authId = localStorage.getItem("authId");
  const maxHash = localStorage.getItem("maxHash");

  return new Configuration({
    basePath,
    baseOptions: {
      headers: {
        ...(authId ? { authId } : {}),
        ...(maxHash ? { maxHash } : {}),
      },
    },
  });
};


const QueueManagementPage: React.FC = () => {
    const { id: orgId } = useParams<{ id: string }>();
    const [userQueues, setUserQueues] = useState<SimpleQueue[]>([]);
    const authId = localStorage.getItem("authId") ?? '';
    const maxHash = localStorage.getItem("maxHash") ?? '';

    useEffect(() => {
        if (!orgId) return;


        const config = createApiConfiguration();
        const orgApi = new OrganizationsApi(config);

        orgApi.getOrganizationQueues(orgId, authId, maxHash)
        .then(res => {
        const queues: SimpleQueue[] = res.data.queues?.map(q => ({
            id: q.id,
            name: q.name
        })) || [];

        setUserQueues(queues);
        })
    .catch(console.error);
    }, [orgId]);
    const MAX_CONTENT_WIDTH = '300px'; 
    const HORIZONTAL_PADDING = '16px'; 
    
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
            <Logo />

            <Flex
                direction="column"
                align="center"
                style={{
                    width: '100%',
                    maxWidth: MAX_CONTENT_WIDTH,
                    margin: '0 auto', 
                    padding: `0px ${HORIZONTAL_PADDING}`,
                    boxSizing: 'border-box',
                    gap: '12px', 
                }}
            >
                    <div style={{ width: '300px' }}>
                        {userQueues.length > 0 && (
                            <Flex direction="column" align="center">
                               { userQueues.map((queue) => (
                                    <QueueManagmentButton 
                                        key={queue.id}
                                        name={queue.name}
                                        id={queue.id}
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