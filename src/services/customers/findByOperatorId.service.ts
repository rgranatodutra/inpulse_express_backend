import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Customer } from "../../entities/customer";
import { ClientCampaign } from "../../entities/clientCampaign.entity";
import { Wnumber } from "../../entities/wnumber.entity";
import WhatsappWeb, { runningAttendances } from "../../WebSocket/WhatsappClient";
import { Attendance } from "../../entities/attendance.entity";

export async function findByOperatorIdService(CODIGO_OPERADOR: number) {
    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);
    const clientsCampaignRepository: Repository<ClientCampaign> = AppDataSource.getRepository(ClientCampaign);
    const clientsNumbersRepository: Repository<Wnumber> = AppDataSource.getRepository(Wnumber);

    const findInClientsCampaign = await clientsCampaignRepository.find({
        where: { CONCLUIDO: "NAO", OPERADOR: CODIGO_OPERADOR }
    });

    const clientIds = findInClientsCampaign.map(cc => cc.CLIENTE);
    if (!clientIds.length) return

    const findNumbers = await clientsNumbersRepository.createQueryBuilder("clientes_numeros")
        .where("CODIGO_CLIENTE in (:...ids)", { ids: clientIds })
        .getMany();

    let allOperatorClients = [];

    if (findNumbers.length) {
        for (const n of findNumbers) {
            const findCustomer = await customersRepository.findOne({ where: { CODIGO: n.CODIGO_CLIENTE } });
            if (findCustomer) {
                const PFP = process.env.OFICIAL_WHATSAPP === "false" && await WhatsappWeb.getProfilePicUrl(`${n.NUMERO}@c.us`);
                allOperatorClients.push({
                    CODIGO_CLIENTE: n.CODIGO_CLIENTE,
                    CODIGO_NUMERO: n.CODIGO,
                    NOME: n.NOME,
                    RAZAO: findCustomer.RAZAO,
                    PESSOA: findCustomer.PESSOA,
                    CPF_CNPJ: findCustomer.CPF_CNPJ,
                    AVATAR: PFP || null,
                    WPP: n.NUMERO
                });
            };
        };
    };

    const clientsWithoutRunningAttendance = allOperatorClients.filter(c => !runningAttendances.find({ CODIGO_NUMERO: c.CODIGO_NUMERO }));

    return clientsWithoutRunningAttendance;
};