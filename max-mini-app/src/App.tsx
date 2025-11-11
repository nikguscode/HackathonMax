import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QueueDetailsPage from "./pages/QueueDetailsPage";
import QueueManagmentPage from "./pages/QueueManagmentPage";
import QueueUserManagementPage from "./pages/QueueUserManagementPage";
import ModeratorDashboardPage from "./pages/ModeratorDashboardPage";
import OrganizationDetailsPage from "./pages/OrganizationDetailsPage";
import ModeratorQueueDetailsPage from "./pages/ModeratorQueueDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/queue/:id" element={<QueueDetailsPage />} />
        <Route path="/managment/:id" element={<QueueManagmentPage />} />
        <Route path="/managment/queue/:id" element={<QueueUserManagementPage />} />
        <Route path="/moderator/:name" element={<ModeratorDashboardPage />} />
        <Route path="/organization/:id" element={<OrganizationDetailsPage />} />
        <Route path="/moderator-queue/:id" element={<ModeratorQueueDetailsPage />} />
        <Route path="*" element={<div>404 | Страница не найдена</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

