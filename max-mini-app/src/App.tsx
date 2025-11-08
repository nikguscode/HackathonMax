import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, Flex } from '@maxhub/max-ui';

import OrganizationCard from './OrganizationCard.tsx';
import QueueCard from './QueueCard.tsx';
import ModeratorCard from './components/ModeratorCard.tsx';
import { moderatorOrgs, userQueues, moderatorQueue } from './mockData.ts';
import type { IOrganization, IQueue } from './types.ts';
import QueueDetailsPage from './pages/QueueDetailsPage.tsx';
import QueueManagmentPage from './pages/QueueManagmentPage.tsx';
import QueueUserManagementPage from './pages/QueueUserManagementPage.tsx';
import ModeratorDashboardPage from './pages/ModeratorDashboardPage.tsx';

import logo from '/logo.jpg'; 

const HomePage: React.FC = () => {
  return (
    <Container style={{ 
      backgroundColor: '#FFFFFF',
      minHeight: '100vh'
    }}>
      <Flex justify="center" align="center" gap={ 0 } style={{  }}>
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
          <div style={{ marginBottom: 16 }}>
            <Flex direction="column" align="center">
              <ModeratorCard
                name={moderatorQueue.name}
                count={moderatorQueue.count}
                queueId={moderatorQueue.id}
              />
            </Flex>
          </div>

          {moderatorOrgs.length > 0 && (
            <div style={{ marginBottom: 16 }}>
            <Flex direction="column" align="center">
              {moderatorOrgs.map((org: IOrganization) => (
                <OrganizationCard
                  key={org.id}
                  name={org.name}
                  count={org.count}
                  orgId={org.id}
                />
              ))}
              </Flex>
            </div>
          )}

          {userQueues.length > 0 && (
            <div>
              <Flex direction="column" align="center">
              {userQueues.map((queue: IQueue) => (
                <QueueCard
                  key={queue.id}
                  name={queue.name}
                  count={queue.count}
                  queueId={queue.id}
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
        <Route path="/queue/:id" element={<QueueDetailsPage />} />
        <Route path="/managment/:id" element={<QueueManagmentPage />} />
        <Route path="/managment/queue/:id" element={<QueueUserManagementPage />} />
        <Route path="/moderator" element={<ModeratorDashboardPage />} />
        <Route path="*" element={<div>404 | Страница не найдена</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;