import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, Flex } from '@maxhub/max-ui';
import OrganizationCard from './OrganizationCard.tsx';
import QueueCard from './QueueCard.tsx';
import type { Organization, QueueEntry } from './api';
import QueueDetailsPage from './pages/QueueDetailsPage.tsx';
import QueueManagmentPage from './pages/QueueManagmentPage.tsx';
import QueueUserManagementPage from './pages/QueueUserManagementPage.tsx';
import ModeratorDashboardPage from './pages/ModeratorDashboardPage.tsx';
import OrganizationDetailsPage from './pages/OrganizationDetailsPage.tsx';
import ModeratorQueueDetailsPage from './pages/ModeratorQueueDetailsPage.tsx';
import { UsersApi, Configuration } from './api';
import logo from '/logo.jpg';

const getMaxId = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const maxIdFromUrl = urlParams.get('maxId');
  if (maxIdFromUrl) {
    return maxIdFromUrl;
  }

  const maxIdFromEnv = import.meta.env.VITE_MAX_ID;
  if (maxIdFromEnv) {
    return maxIdFromEnv;
  }
  return '1';
};

const createApiConfiguration = (): Configuration => {
  const basePath = import.meta.env.VITE_API_BASE_PATH || 'http://localhost:8080';
  return new Configuration({
    basePath,
  });
};

const HomePage: React.FC = () => {
  const [moderatorOrgs, setModeratorOrgs] = useState<Organization[]>([]);
  const [userQueues, setUserQueues] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const config = createApiConfiguration();
      const apiBasePath = config.basePath; 
      
      try {
        setLoading(true);
        setError(null);

        const maxId = getMaxId();

        if (!maxId) {
          setError('Max ID не найден. Укажите maxId в параметрах URL (?maxId=xxx) или в переменной окружения VITE_MAX_ID');
          setLoading(false);
          return;
        }

        const maxIdNum = Number(maxId);
        
        console.log('Используется maxId:', maxId);
        console.log('API Base Path:', apiBasePath);
        
        const usersApi = new UsersApi(config);

        console.log('Запрос к API:', `/users/${maxIdNum}`);
        
        const response = await usersApi.getUserByMaxId(maxIdNum);
        const userResponse = response.data;

        

        console.log('API Response:', userResponse);

        if (!userResponse) {
          setError('Ответ от сервера пустой. Проверьте подключение к API');
          setLoading(false);
          return;
        }

        const organizationsList = userResponse.organizations || [];
        const queueList = userResponse['queue-entries'] || [];
        
        if (organizationsList.length === 0) {
          console.log('Список организаций пуст');
          setModeratorOrgs([]);
          setUserQueues([]);
          setLoading(false);
          return;
        }

        const adminOrgs: Organization[] = [];
        const queues: QueueEntry[] = [];

        for (const org of organizationsList) {
          if (!org.id || !org.name || !org.role) continue;
          
          // let canManageQueues = false;
          // let orgQueues: any[] = [];
          
          if (org.role === 'MODERATOR' || org.role === 'EMPLOYEE') {

              adminOrgs.push({
                id: org.id,
                name: org.name,
                role: org.role,
                amountOfQueues: org.amountOfQueues,
              });
          } 
        }
        for (const queue of queueList) {
          if (!queue.id || !queue.name) continue;
              queues.push({
                id: queue.id,
                name: queue.name,
                peopleInFront: queue.peopleInFront,
              });
        }
        setModeratorOrgs(adminOrgs);
        setUserQueues(queues);
        setLoading(false);

      } catch (err: any) {
        console.error('Ошибка при загрузке данных:', err);
        
        if (err.response) {
          if (err.response.status === 404) {
            setError('Пользователь не найден. Проверьте правильность maxId');
          } else if (err.response.data?.message) {
            setError(err.response.data.message);
          } else {
            setError(`Ошибка сервера (${err.response.status})`);
          }
        } else if (err.request) {
          setError(`Не удалось подключиться к API по адресу ${apiBasePath}. Убедитесь, что мок-сервер из bot.ts запущен на порту 8080`);
        } else if (err.message) {
          setError(`Ошибка: ${err.message}`);
        } else {
          setError('Произошла ошибка при загрузке данных');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <Container style={{ 
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div>Загрузка...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ 
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        <div style={{ color: '#DC3545', textAlign: 'center' }}>
          {error}
        </div>
      </Container>
    );
  }

  return (
  <Container style={{ 
    backgroundColor: '#FFFFFF',
    minHeight: '100vh'
  }}>
    <Flex justify="center" align="center" gap={ 0 } style={{  }}>
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

      <Flex direction="column" align="center" style={{ width: '100%', maxWidth: '300px', margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ width: '300px' }}>
          {moderatorOrgs.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Flex direction="column" align="center">
                {moderatorOrgs.map((org: Organization) => (
                  <OrganizationCard
                    key={org.id}
                    name={org.name}
                    amountOfQueues={org.amountOfQueues}
                    id={org.id}
                  />
                ))}
              </Flex>
            </div>
          )}

          {userQueues.length > 0 && (
            <div>
              <Flex direction="column" align="center">
                {userQueues.map((queue: QueueEntry) => (
                  <QueueCard
                  key={queue.id}
                  name={queue.name}
                  peopleInFront={queue.peopleInFront}
                  id={queue.id}
                  />
                  ))}
                  </Flex>
              </div>
            )}
          </div>
        </Flex>
      </Container>
    );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/queue/:id" element={ <QueueDetailsPage /> } />
        <Route path="/managment/:id" element={<QueueManagmentPage />} />
        <Route path="/managment/queue/:id" element={<QueueUserManagementPage />} />
        <Route path="/moderator" element={<ModeratorDashboardPage />} />
        <Route path="/organization/:id" element={<OrganizationDetailsPage />} />
        <Route path="/moderator-queue/:id" element={<ModeratorQueueDetailsPage />} />
        <Route path="*" element={<div>404 | Страница не найдена</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;