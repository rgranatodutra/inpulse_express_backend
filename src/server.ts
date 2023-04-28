import app from "./app";
import { AppDataSource } from "./data-source";
import { cronJob } from "./job/updateAttendanceStatus.job";
import services from "./services";
import { Sessions } from "./WebSocket/Sessions";
import WebSocket from "./WebSocket/WebSocket";
import WhatsappWeb, { getRunningAttendances, runningAttendances } from "./WebSocket/WhatsappClient";

const PORT: number = Number(process.env.PORT) || 8000;
const SOCKET_PORT: number = Number(process.env.SOCKET_PORT) || 5000;

async function initialize () {
    await AppDataSource.initialize()
    console.log('Database connected.');

    WebSocket.listen(SOCKET_PORT, { cors: {
        origin: "*",
        methods: ["GET", "POST"]
    } });

    console.log(`Socket.io server is running on http://localhost:${SOCKET_PORT}`);

    app.listen(PORT, () => {
        console.log(`App is running on http://localhost:${PORT}`);
    });
    
    await WhatsappWeb.initialize().then(_ => console.log("Whatsapp Initialized"));
    await getRunningAttendances()
    const allOperators = await services.users.getAll(999, 1, "");
    for(const op of allOperators.dados) {
        await Sessions.addSession(op.CODIGO, null);
    };
    const operators = Array.from(new Set(runningAttendances.value.map(r => r.CODIGO_OPERADOR)));
    operators.forEach(async(o) => {
        const attendances = runningAttendances.getAttendancesNumber(o);
        Sessions.updateOperatorRunningAttendances(o, attendances);
    });
 
    console.log("Job started.", new Date().toLocaleString())
    cronJob
};

initialize();