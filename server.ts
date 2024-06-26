import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

// Configura el middleware CORS para permitir todas las solicitudes desde cualquier origen
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
}));

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    },
});


const rooms: { [mac: string]: string } = {};

app.use(express.json());

app.post('/register', (req: any, res: any) => {
    const { mac } = req.body;
    if (!mac) {
        return res.status(400).json({ error: 'Missing MAC address' });
    }
    console.log(`Registrando dispositivo con MAC: ${mac}`);
    const roomCode = Math.random().toString(36).substring(7);
    rooms[mac] = roomCode;

    return res.json({ roomCode });
});

io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    socket.on('joinRoom', (roomCode) => {
        socket.join(roomCode);
        console.log(`Usuario ${socket.id} se unió a la sala ${roomCode}`);
    });

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Servidor HTTP y Socket.IO escuchando en el puerto ${PORT}`);
});

