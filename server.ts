import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms: { [mac: string]: string } = {};

app.use(express.json());

app.post('/register', (req: any, res: any) => {
    const { mac } = req.body;
    if (!mac) {
        return res.status(400).json({ error: 'Missing MAC address' });
    }

    const roomCode = Math.random().toString(36).substring(7);
    rooms[mac] = roomCode;

    return res.json({ roomCode });
});

io.on('connection', (socket: Socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    socket.on('joinRoom', (roomCode: string) => {
        socket.join(roomCode);
        console.log(`Usuario ${socket.id} se unió a la sala ${roomCode}`);
    });

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor HTTP y Socket.IO escuchando en el puerto ${PORT}`);
});
