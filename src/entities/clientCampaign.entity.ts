import { 
    Column,
    Entity, 
    PrimaryGeneratedColumn, 
} from "typeorm";

@Entity('campanhas_clientes')
export class ClientCampaign {
    @PrimaryGeneratedColumn()
    CODIGO: number;
    
    @Column({ type: 'int', nullable: true, default: 0 })
    CLIENTE: number;

    @Column({ type: 'int', nullable: true, default: 0 })
    CAMPANHA: number;

    @Column({ type: 'date', nullable: true, default: '0000-00-00' })
    DT_RESULTADO: Date;

    @Column({ type: 'datetime', nullable: true, default: '0000-00-00 00:00:00' })
    DT_AGENDAMENTO: Date;

    @Column({ type: 'datetime', nullable: true, default: '0000-00-00 00:00:00' })
    DATA_HORA_LIG: Date;

    @Column({ type: 'int', nullable: true, default: 0 })
    RESULTADO: number;

    @Column({ type: 'enum', enum: ['SIM', 'NAO'], nullable: true, default: null })
    CONCLUIDO: "SIM" | "NAO";

    @Column({ type: 'varchar', length: 12, nullable: true, default: ''})
    FONE1: string;

    @Column({ type: 'varchar', length: 12, nullable: true, default: ''})
    FONE2: string;

    @Column({ type: 'varchar', length: 12, nullable: true, default: ''})
    FONE3: string;
};