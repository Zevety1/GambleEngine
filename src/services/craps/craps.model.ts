import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn} from 'typeorm';

@Entity({
    name:'craps'
})
export class CrapsModel {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type:'text', nullable: false})
    user_id:string;

    @Column({type:'int', nullable: false, default: 0})
    set_value:number;

    @Column({type:'int', nullable: false, default: 1})
    stage_game:number;

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date;
}