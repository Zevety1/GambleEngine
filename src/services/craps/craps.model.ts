import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity({
    name:'craps',
})
export class CrapsModel {
    @PrimaryGeneratedColumn('uuid')
        id:string;

    @Column({ type:'text', nullable: false, name: 'user_id' })
        userId:string;

    @Column({ type:'int', nullable: false, name: 'bet' })
        bet:number;

    @Column({ type:'int', nullable: false, default: 0, name: 'set_value' })
        setValue:number;

    @Column({ type:'int', nullable: false, default: 1, name: 'stage_game' })
        stageGame:number;

    @Column({ type:'boolean', nullable: false, default: true, name: 'active_game' })
        activeGame:boolean;

    @Column({ type:'boolean', nullable: true, name: 'is_win' })
        isWin:boolean;

	@UpdateDateColumn({
	    name: 'updated_at',
	  })
	    updatedAt: Date;

    @CreateDateColumn({
	    name: 'created_at',
    })
        createdAt: Date;
}