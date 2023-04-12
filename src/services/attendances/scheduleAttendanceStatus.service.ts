import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { runningAttendances } from "../../WebSocket/WhatsappClient";
import services from "..";
import WhatsappWeb from "../../WebSocket/WhatsappClient";
import { Attendance } from "../../entities/attendance.entity";

export async function updateAttendanceStatus(): Promise<void> {
    const attendanceRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);

    const scheduledAttendances: Attendance[] = await attendanceRepository
        .createQueryBuilder("attendance")
        .where("attendance.DATA_AGENDAMENTO IS NOT NULL")
        .getMany();

    const agora = Date.now();
    const agendamento = (date: Date) => date.getTime();
    
    console.log(scheduledAttendances);

    
    const result = scheduledAttendances.filter(item => item.DATA_AGENDAMENTO && agendamento(item.DATA_AGENDAMENTO) <= agora );
    console.log("result", result);

    result.forEach(async(attendance) => { 
        const number = await services.wnumbers.getById(attendance.CODIGO_NUMERO);
        const avatar = number && await WhatsappWeb.getProfilePicUrl(`${number.NUMERO}@c.us`)

        console.log(attendance);

        number && runningAttendances.create({
            CODIGO_ATENDIMENTO: attendance.CODIGO,
            CODIGO_CLIENTE: attendance.CODIGO_CLIENTE,
            CODIGO_NUMERO: attendance.CODIGO_NUMERO,
            CODIGO_OPERADOR: attendance.CODIGO_OPERADOR,
            DATA_INICIO: new Date(),
            MENSAGENS: [],
            WPP_NUMERO: number.NUMERO,
            AVATAR: avatar || ""
        });

        runningAttendances.returnOperatorAttendances(attendance.CODIGO_OPERADOR);

        attendanceRepository.save({ ...attendance, DATA_AGENDAMENTO: "", CONCLUIDO: 0 });
    });
};