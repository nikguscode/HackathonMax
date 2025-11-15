import React, {useState, useEffect} from 'react';
import { Container, Flex } from '@maxhub/max-ui';
import { useParams } from 'react-router-dom';
import Logo from '../components/Logo';
import QueueManagmentButton from '../components/QueueManagmentButton';
import { OrganizationsApi, Configuration, SimpleQueue } from '../api';
import SkeletonQueueManagement from '../components/Skeletons/SkeletonQueueManagementPage';
import { showErrorToast } from '../utils/showErrorToast';

const createApiConfiguration = (): Configuration => {
  const basePath =
    import.meta.env.VITE_API_BASE_PATH || "http://localhost:8080/v1/api";

  const authId = sessionStorage.getItem("authId");
  const maxHash = sessionStorage.getItem("maxHash");

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
    const [loading, setLoading] = useState(true);
    const authId = sessionStorage.getItem("authId") ?? '';
    const maxHash = sessionStorage.getItem("maxHash") ?? '';

    useEffect(() => {
        if (!orgId) {
        setLoading(false);
        showErrorToast({ message: "ID организации не указан" });
        return;
        }

        const fetchQueues = async () => {
        try {
            setLoading(true);

            const config = createApiConfiguration();
            const orgApi = new OrganizationsApi(config);

            const res = await orgApi.getOrganizationQueues(orgId, authId, maxHash);
            const queues: SimpleQueue[] = res.data.queues?.map(q => ({
            id: q.id,
            name: q.name,
            })) || [];

            setUserQueues(queues);
        } catch (err) {
            console.error(err);
            showErrorToast('Не удалось загрузить очереди');
        } finally {
            setLoading(false);
        }
        };

        fetchQueues();
    }, [orgId, authId, maxHash]);

    const MAX_CONTENT_WIDTH = '300px'; 
    const HORIZONTAL_PADDING = '16px'; 
    
    if (!orgId) {   
        return (
            <Container style={{ backgroundColor: '#E5E5E5', minHeight: '100vh', padding: '20px' }}>
                <div>Ошибка: ID организации не указан</div>
            </Container>
        );
    }

    if (loading) {
        return <SkeletonQueueManagement/>;
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