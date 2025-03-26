import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn} from 'typeorm';
import {iCard} from '../../classes/blackJackClass'

@Entity({
    name:'blackjack'
})
export class BlackJackModel {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type:'text', nullable: false, name: 'user_id'})
    userId:string;

    @Column({type:'int', nullable: false, name: 'bet_in_game'})
    betInGame:number;

    @Column({type:'int', nullable: false, default: 1, name: 'stage_game'})
    stageGame:number;

    @Column({type: 'json', nullable:false, default: [], name: 'player_hand'})
    playerHand:iCard[];

    @Column({type: 'json', nullable:false, default: [], name:'dealer_hand'})
    dealerHand:iCard[]

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