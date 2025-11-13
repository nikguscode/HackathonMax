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
import SkeletonCard from "./components/Skeletons/Skeleton.tsx";
import QueueUserModeratorPage from "./pages/QueueUserModeratorPage.tsx";

<script src="https://st.max.ru/js/max-web-app.js"></script>

const getMaxId = (): string | null => {
  if (window.WebApp?.initDataUnsafe?.user?.id) {
    console.log("MaxBridge: найден пользователь через WebApp:", window.WebApp.initDataUnsafe.user);
    return String(window.WebApp.initDataUnsafe.user.id);
  }

  // Если нет — fallback: URL-параметр или переменная окружения
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

  const authId = localStorage.getItem("authId");
  const maxHash = localStorage.getItem("maxHash");
  // const orgName = localStorage.getItem("orgName");

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAndLoadUserData = async () => {
      if (!window.WebApp) {
        console.warn("MAX Bridge не найден. Возможно, вы не в среде MAX.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const maxId = getMaxId();
        if (!maxId) {
          setError("Max ID не найден");
          setLoading(false);
          return;
        }

        // 1️⃣ Авторизация
        const authConfig = createApiConfiguration();
        const usersApiAuth = new UsersApi(authConfig);
        const body = { miniAppInitData: window.WebApp.initData };
        const authResponse = await usersApiAuth.sendUserMiniAppData(Number(maxId), body);

        if (authResponse.status === 200 && (authResponse.data as any)?.authId) {
          const maxHash = (authResponse.data as any).maxHash;
          const authId = (authResponse.data as any).authId;
          localStorage.setItem("maxHash", maxHash);
          localStorage.setItem("authId", authId);
          console.log("✅ Авторизация успешна, maxHash сохранён:", maxHash);
          console.log("✅ Авторизация успешна, maxId сохранён:", authId);
          console.log("✅ Авторизация успешна, maxHash сохранён:", authResponse.request);
          const config = createApiConfiguration();
          const usersApi = new UsersApi(config);
          const userResponse = (await usersApi.getUserByMaxId(Number(maxId), authId, maxHash)).data;


          if (!userResponse) {
            setError("Ответ от сервера пустой. Проверьте подключение к API");
            setLoading(false);
            return;
          }

          const organizationsList = userResponse.organizations || [];
          const queueList = userResponse["queue-entries"] || [];

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

          setModeratorOrgs(adminOrgs);
          setUserQueues(queues);
        } else {
          setError("Ошибка авторизации. Попробуйте перезапустить Mini App.");
          setLoading(false);
          return;
        }

      } catch (err: any) {
        console.error("Ошибка при загрузке данных:", err);

        if (err.response?.status === 401) {
          setError("⛔ Доступ запрещён. Перезапустите мини-приложение.");
        } else if (err.response?.status === 404) {
          setError("Пользователь не найден.");
        } else {
          setError("Ошибка при загрузке данных с сервера.");
        }
      } finally {
        setLoading(false);
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

  if (error) {
    return (
      <Container
        style={{
          backgroundColor: "#FFFFFF",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div style={{ color: "#DC3545", textAlign: "center" }}>{error}</div>
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
    </BrowserRouter>
  );
}
// 
export default App;