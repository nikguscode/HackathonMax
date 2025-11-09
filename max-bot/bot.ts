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

const MOCK_USER_RESPONSE = {
    user: {
        maxId: 1,
        username: "Иван Тестовый"
    },
    organizations: [
        { 
            id: "org_mod_1", 
            name: "Ресторан 'Сигма' (Админ)", 
            // Используем 'ADMIN' или 'MANAGER' для модераторских прав, согласно API-схеме
            role: 'ADMIN', 
            // app.tsx использует это поле, чтобы показать количество очередей
            amountOfQueues: 2 // Две очереди: столик и доставка
        },
        { 
            id: "org_emp_1", 
            name: "Кафе 'Уютное место' (Клиент)", 
            // Роль CLIENT, не отображается как модераторская
            role: 'CLIENT', 
            amountOfQueues: 0 
        },
        { 
            id: "org_user_2", 
            name: "Фитнес-клуб 'Сила'", 
            role: 'MANAGER', // Отображается как модераторская
            amountOfQueues: 3
        },
    ]
};

const getOrgQueues = (orgId: string) => {
    if (orgId === "org_mod_1") {
        return {
            queues: [
                { id: "q_org_mod_1", name: "Очередь на столик" },
                { id: "q_org_mod_2", name: "Очередь на доставку" },
            ]
        };
    } else if (orgId === "org_emp_1") {
        return {
            queues: [
                { id: "q_org_emp_1", name: "Очередь на заказ" },
                { id: "q_org_emp_2", name: "Очередь на кассу" },
            ]
        };
    }
    return {
        queues: []
    };
};

const MOCK_QUEUE_METRICS = {
    metrics: {
        entriesInTheQueue: 15 
    }
};

const app = express();
const API_PORT = 8080;

app.use(cors());

app.get('/users/:maxId', (req: Request, res: Response) => {
    const maxId = req.params.maxId;
    if (maxId === '1' || maxId === 'placeholder_maxid') {
        return res.json(MOCK_USER_RESPONSE);
    } else {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }
});

app.get('/organizations/:orgId/queues', (req: Request, res: Response) => {
    const orgId = req.params.orgId;
    const queuesData = getOrgQueues(orgId);
    
    if (queuesData.queues.length === 0 && orgId !== "org_mod_1" && orgId !== "org_emp_1") {
        return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    return res.json(queuesData);
});

app.get('/queues/:queueId/metrics', (req: Request, res: Response) => {
    return res.json(MOCK_QUEUE_METRICS);
});

app.listen(API_PORT, () => {
    console.log(`Тестовый API-сервер запущен на порту ${API_PORT}.`);
});

// ---------------------------------------------------------------------

bot.start();