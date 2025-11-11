import React, { useState, useEffect } from "react";
import { Container, Flex } from "@maxhub/max-ui";
import type { Organization, QueueEntryInUserResponse } from "../api";
import OrganizationCard from "../components/OrganizationCard";
import QueueCard from "../components/QueueCard";
import Logo from "../components/Logo";
import { UsersApi, Configuration } from "../api";

const getMaxId = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("maxId") || import.meta.env.VITE_MAX_ID || "4";
};

const createApiConfiguration = (): Configuration => {
  const basePath = import.meta.env.VITE_API_BASE_PATH || "http://localhost:8080/v1/api";
  return new Configuration({ basePath });
};

const HomePage: React.FC = () => {
  const [moderatorOrgs, setModeratorOrgs] = useState<Organization[]>([]);
  const [userQueues, setUserQueues] = useState<QueueEntryInUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const maxId = getMaxId();
        if (!maxId) throw new Error("Max ID не найден");

        const config = createApiConfiguration();
        const usersApi = new UsersApi(config);
        const response = await usersApi.getUserByMaxId(Number(maxId));
        const userResponse = response.data;

        if (!userResponse) throw new Error("Ответ от сервера пустой");

        const orgs = (userResponse.organizations || []).filter(
          (org) => org.role === "MODERATOR" || org.role === "EMPLOYEE"
        );
        const queues = userResponse["queue-entries"] || [];

        setModeratorOrgs(orgs);
        setUserQueues(queues);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Произошла ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  if (loading) return <Container>Загрузка...</Container>;
  if (error) return <Container>{error}</Container>;

  return (
    <Container>
      <Logo />
      <Flex direction="column" align="center" style={{ maxWidth: 300, margin: "0 auto" }}>
        <Flex direction="column" align="center" style={{maxWidth: 300}}>
          {moderatorOrgs.map((org) => (
            <OrganizationCard key={org.id} {...org} />
          ))}
        </Flex>
        <Flex direction="column" align="center" style={{maxWidth: 300, paddingTop: '10px'}}>
          {userQueues.map((queue) => (
            <QueueCard key={queue.id} {...queue} />
          ))}
        </Flex>
      </Flex>
    </Container>
  );
};

export default HomePage;
