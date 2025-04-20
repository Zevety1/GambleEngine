import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity({
    name:'slots_jackpot',
})
export class SlotsJackpotModel {
    @PrimaryGeneratedColumn('uuid')
        id:string;

    @Column({ type:'float', nullable: false, default: 100, name: 'jackpot' })
        jackpot:number;

    @Column({ type:'boolean', nullable: false, default: true, name: 'active_jackpot' })
        activeJackpot:boolean;

	@UpdateDateColumn({
	    name: 'updated_at',
	   })
	    updatedAt: Date;

    @CreateDateColumn({
	    name: 'created_at',
	   })
	    createdAt: Date;
}