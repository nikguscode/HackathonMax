import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container, Flex } from "@maxhub/max-ui";
import OrganizationCard from "./components/OrganizationCard.tsx";
import QueueCard from "./components/QueueCard.tsx";
import type { Organization, QueueEntryInUserResponse } from "./api";
import QueueDetailsPage from "./pages/QueueDetailsPage.tsx";
import QueueManagmentPage from "./pages/QueueManagmentPage.tsx";
import QueueUserManagementPage from "./pages/QueueUserManagementPage.tsx";
import ModeratorDashboardPage from "./pages/ModeratorDashboardPage.tsx";
import OrganizationDetailsPage from "./pages/OrganizationDetailsPage.tsx";
import ModeratorQueueDetailsPage from "./pages/ModeratorQueueDetailsPage.tsx";
import { UsersApi, Configuration } from "./api";
import Logo from "./components/Logo.tsx";
import SkeletonCard from "./components/Skeletons/SkeletonApp.tsx";
import QueueUserModeratorPage from "./pages/QueueUserModeratorPage.tsx";
import FAQPage from "./pages/FAQPage.tsx";
import { Toaster } from 'react-hot-toast'; 
import { showErrorToast } from "./utils/showErrorToast.ts";

<script src="https://st.max.ru/js/max-web-app.js"></script>

const getMaxId = (): string | null => {
  if (window.WebApp?.initDataUnsafe?.user?.id) {
    return String(window.WebApp.initDataUnsafe.user.id);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const maxIdFromUrl = urlParams.get("maxId");
  if (maxIdFromUrl) return maxIdFromUrl;

  const maxIdFromEnv = import.meta.env.VITE_MAX_ID;
  if (maxIdFromEnv) return maxIdFromEnv;

  return null;
};

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


declare global {
  interface Window {
    WebApp?: any;
  }
}


const HomePage: React.FC = () => {
  const [moderatorOrgs, setModeratorOrgs] = useState<Organization[]>([]);
  const [userQueues, setUserQueues] = useState<QueueEntryInUserResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAndLoadUserData = async () => {
      if (!window.WebApp) {
        console.warn("MAX Bridge не найден. Возможно, вы не в среде MAX.");
        return;
      }

      setLoading(true);

      const maxId = getMaxId();
      if (!maxId) {
        setLoading(false);
        return;
      }

      const savedAuthId = sessionStorage.getItem("authId");
      const savedMaxHash = sessionStorage.getItem("maxHash") ?? '';

      const config = createApiConfiguration();
      const usersApi = new UsersApi(config);

      if (savedAuthId != null) {
        try {
          const userResponse = await usersApi.getUserByMaxId(
            Number(maxId),
            savedAuthId,
            savedMaxHash
          );

          if (userResponse.data) {
            console.log("Токен валиден. Используем сохранённые authId и maxHash.");
            await loadUserData(Number(maxId), savedAuthId, savedMaxHash);
            setLoading(false);
            return;
          }
        } catch (err: any) {
          if (err.response?.status === 401) {
            console.warn("Токен недействителен (401). Переавторизация...");
            sessionStorage.removeItem("authId");
            sessionStorage.removeItem("maxHash");
          } else {
            console.error("Ошибка при проверке токена:", err);
          }
        }
      }

      try {
        const authConfig = createApiConfiguration();
        const usersApiAuth = new UsersApi(authConfig);

        const authResponse = await usersApiAuth.sendUserMiniAppData(Number(maxId), {
          miniAppInitData: window.WebApp.initData,
        });

        if (authResponse.status === 200 && authResponse.data?.authId) {
          const newAuthId = authResponse.data.authId;
          const newMaxHash = authResponse.data.maxHash;

          sessionStorage.setItem("authId", newAuthId);
          sessionStorage.setItem("maxHash", newMaxHash);

          console.log("Авторизация успешна. Сохранены authId и maxHash.");

          await loadUserData(Number(maxId), newAuthId, newMaxHash);
        } else {
          throw new Error("Не удалось получить authId");
        }
      } catch (err: any) {
        console.error("Ошибка авторизации:", err);
        showErrorToast(err);
      } finally {
        setLoading(false);
      }
    };

    const loadUserData = async (maxId: number, authId: string, maxHash: string) => {
      try {
          const config = createApiConfiguration();
          const usersApi = new UsersApi(config);

          const userResponse = await usersApi.getUserByMaxId(maxId, authId, maxHash);

          if (!userResponse.data) {
            throw new Error("Пустой ответ от сервера");
          }

          const organizationsList = userResponse.data.organizations || [];
          const queueList = userResponse.data["queue-entries"] || [];

          const adminOrgs: Organization[] = [];
          const queues: QueueEntryInUserResponse[] = [];

          for (const org of organizationsList) {
            if (org.role === "MODERATOR" || org.role === "EMPLOYEE") {
              adminOrgs.push({
                id: org.id,
                name: org.name,
                role: org.role,
                amountOfQueues: org.amountOfQueues,
              });
            }
          }

          for (const queue of queueList) {
            queues.push({
              id: queue.id,
              name: queue.name,
              peopleInFront: queue.peopleInFront,
            });
          }
            if (moderatorOrgs.length === 0 && userQueues.length === 0 && (authId != '' && maxHash != '')) {
              return(
                <FAQPage/>
              );
            };
          setModeratorOrgs(adminOrgs);
          setUserQueues(queues);
        }catch (err: any) {
          console.error("Ошибка в loadUserData:", err);
          showErrorToast(err);
          throw err;
        }
      };

    initAndLoadUserData();
  }, []);



  if (loading) {
    return (
          <Container
            style={{
              backgroundColor: "#FFFFFF",
              minHeight: "100vh",
            }}
          >
            <Logo />
            {/* Контейнер, имитирующий расположение карточек */}
            <Flex
              direction="column"
              align="center"
              style={{
                width: "100%",
                maxWidth: "300px",
                margin: "0 auto",
                padding: "0px 16px",
              }}
            >
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
            </Flex>
          </Container>
        );
  }


  return (
    <Container
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
      }}
    >
      <Logo />
      <Flex
        direction="column"
        align="center"
        style={{
          width: "100%",
          maxWidth: "300px",
          margin: "0 auto",
          padding: "0px 16px",
        }}
      >
        <div style={{ width: "300px" }}>
          {moderatorOrgs.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Flex direction="column" align="center">
                {moderatorOrgs.map((org: Organization) => (
                  <OrganizationCard
                    key={org.id}
                    name={org.name}
                    amountOfQueues={org.amountOfQueues}
                    role={org.role}
                    id={org.id}
                  />
                  
                ))}
              </Flex>
            </div>
            
          )}

          {userQueues.length > 0 && (
            <div>
              <Flex direction="column" align="center">
                {userQueues.map((queue: QueueEntryInUserResponse) => (
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
        <Route path="/queue/:id" element={<QueueDetailsPage />} />
        <Route path="/managment/:id" element={<QueueManagmentPage />} />
        <Route
          path="/managment/queue/:id"
          element={<QueueUserManagementPage />}
        />
        <Route path="/moderator/:id" element={<ModeratorDashboardPage />} />
        <Route path="/organization/:id" element={<OrganizationDetailsPage />} />
        <Route
          path="/moderator-queue/:id"
          element={<ModeratorQueueDetailsPage />}
        />
        <Route path="/moderator-queue/queue/:id" element={<QueueUserModeratorPage />} />
        <Route path="*" element={<div>404 | Страница не найдена</div>} />
      </Routes>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '15px',
            maxWidth: '300px',
          },
          error: {
            style: {
              background: '#DC3545',
            },
            icon: 'Error',
          },
        }}
      />
    </BrowserRouter>
  );
}
// 
export default App;