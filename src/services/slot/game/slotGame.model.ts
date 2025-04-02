import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn} from 'typeorm';
import {iSlot} from '../../../classes/slotsClass'

@Entity({
    name:'slots_game'
})
export class SlotsGameModel {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type:'text', nullable: false, name: 'user_id'})
    userId:string;

    @Column({type:'int', nullable: false, name: 'bet'})
    bet:number;

    @Column({type: 'json', nullable:false, default: [], name: 'slots'})
    slots:iSlot[];

    @Column({type: 'int', nullable:true, name:'win_amount'})
    winAmount:number

    @Column({type:'boolean', nullable: false, default: true, name: 'active_game' })
    activeGame:boolean;

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date;

    @CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date;
}