import { Bot } from '@maxhub/max-bot-api';
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.BOT_TOKEN;

if (!token) {
    console.error('Ошибка: BOT_TOKEN не найден.');
    console.error('Пожалуйста, создайте файл .env и добавьте в него BOT_TOKEN.');
    process.exit(1); 
}

const bot = new Bot(token);

bot.api.setMyCommands([
  { 
    name: 'ping',
    description: 'Сыграть в пинг-понг'
  },
]);

bot.on('bot_started', (ctx) => ctx.reply('Привет! Отправь мне команду /ping, чтобы сыграть в пинг-понг'));

bot.command('ping', (ctx) => ctx.reply('pong'));
bot.hears('hello', (ctx) => ctx.reply('world'));

// ---------------- MOCK DATA -----------------

interface Organization {
  id: string;
  name: string;
  role: 'MODERATOR' | 'EMPLOYEE' | 'CLIENT';
  amountOfQueues: number;
}

interface QueueMetrics {
  entriesInTheQueue: number;
  waitingTime: number;
  numberOfServedMembers: number;
  serviceTime: number;
  totalLeft: number;
}

// Пользователь с организациями
const MOCK_USER_RESPONSE = {
  organizations: [
    { id: "org_mod_1", name: "Ресторан 'Сигма' (Админ)", role: 'MODERATOR', amountOfQueues: 2 },
    { id: "org_emp_1", name: "Кафе 'Уютное место' (Клиент)", role: 'CLIENT', amountOfQueues: 0 },
    { id: "org_user_2", name: "Фитнес-клуб 'Сила'", role: 'EMPLOYEE', amountOfQueues: 3 },
  ],
  'queue-entries': [
    { id: "1", name: "string", peopleInFront: 0, status: "WAITING" }
  ]
};

// Очереди организаций
interface Queue {
  id: string;
  name: string;
}

const ORG_QUEUES: Record<string, Queue[]> = {
  org_mod_1: [
    { id: "q_org_mod_1", name: "Очередь на столик" },
    { id: "q_org_mod_2", name: "Очередь на доставку" },
  ],
  org_emp_1: [
    { id: "q_org_emp_1", name: "Очередь на заказ" },
    { id: "q_org_emp_2", name: "Очередь на кассу" },
  ],
};

// Метрики очередей
const QUEUE_METRICS: Record<string, QueueMetrics> = {
  q_org_mod_1: { entriesInTheQueue: 3, waitingTime: 12, numberOfServedMembers: 15, serviceTime: 5, totalLeft: 2 },
  q_org_mod_2: { entriesInTheQueue: 1, waitingTime: 5, numberOfServedMembers: 20, serviceTime: 7, totalLeft: 0 },
  q_org_emp_1: { entriesInTheQueue: 2, waitingTime: 8, numberOfServedMembers: 10, serviceTime: 6, totalLeft: 1 },
  q_org_emp_2: { entriesInTheQueue: 0, waitingTime: 0, numberOfServedMembers: 5, serviceTime: 4, totalLeft: 0 },
};

// ---------------- EXPRESS SERVER -----------------

const app = express();
const API_PORT = 8080;

app.use(cors());
app.use(express.json());

// Получение пользователя
app.get('/v1/api/users/:maxId', (req: Request, res: Response) => {
  const { maxId } = req.params;
  if (maxId) {
    return res.json(MOCK_USER_RESPONSE);
  }
  return res.status(404).json({ message: "Пользователь не найден" });
});

// Очереди организации
app.get('/v1/api/organizations/:orgId/queues', (req: Request, res: Response) => {
  const { orgId } = req.params;
  const queues = ORG_QUEUES[orgId];
  if (!queues) return res.status(404).json({ message: "Очереди не найдены" });
  return res.json({ queues });
});

// Метрики очереди
app.get('/v1/api/queues/:queueId/metrics', (req: Request, res: Response) => {
  const { queueId } = req.params;
  const metrics = QUEUE_METRICS[queueId];
  if (!metrics) return res.status(404).json({ message: "Метрики не найдены" });
  return res.json({ metrics });
});

app.get('/v1/api/organizations/:orgId/settings', (req: Request, res: Response) => {
  const { orgId } = req.params;

  const org = MOCK_USER_RESPONSE.organizations.find(o => o.id === orgId);
  if (!org) return res.status(404).json({ message: "Организация не найдена" });

  return res.json({ organization: { id: org.id, name: org.name, role: org.role, amountOfQueues: org.amountOfQueues } });
});

// POST MiniApp (mock)
app.post('/v1/api/users/:maxId/mini-app', (req: Request, res: Response) => {
  const { maxId } = req.params;
  if (!maxId) return res.status(400).json({ message: "maxId не указан" });

  const mockResponse = {
    maxHash: `mock-hash-for-${maxId}-${Date.now()}`,
  };
  console.log(`✅ Возвращаем mockHash для пользователя ${maxId}`);
  return res.status(200).json(mockResponse);
});

// POST новая очередь для организации
app.post('/v1/api/organizations/:orgId/queues', (req: Request, res: Response) => {
    const { orgId } = req.params;
    const { name, arrivalGracePeriod, maxQueueSize } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Название очереди обязательно" });
    }

    console.log(`Создаем очередь "${name}" для организации ${orgId}`, {
        arrivalGracePeriod,
        maxQueueSize
    });

    // Генерируем фейковый ID для новой очереди
    const newQueue = {
        id: `q_${orgId}_${Date.now()}`,
        name,
        metrics: {
            entriesInTheQueue: 0,
            waitingTime: 0,
            numberOfServedMembers: 0,
            serviceTime: 0,
            totalLeft: 0,
            maxInQueue: 0,
            minInQueue: 0,
            averageInQueue: 0,
        }
    };

    // Можно хранить в массиве, если хочешь, чтобы фронт потом видел
    if (!ORG_QUEUES[orgId]) ORG_QUEUES[orgId] = [];
    ORG_QUEUES[orgId].push({ id: newQueue.id, name: newQueue.name });

    return res.status(201).json(newQueue);
});


// ---------------- START SERVER -----------------

app.listen(API_PORT, () => {
  console.log(`Тестовый API-сервер запущен на порту ${API_PORT}.`);
});

bot.start();
