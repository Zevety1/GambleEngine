import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name:'users',
})
export class UserModel {
    @PrimaryGeneratedColumn('uuid')
        id:string;

    @Column({ type:'text', nullable: false })
        username:string;

    @Column({ type:'text', nullable: false })
        password:string;

    @Column({ type:'int', nullable: false, default: 100 })
        balance:number;

    @CreateDateColumn({
        name: 'created_at',
	  })
	    createdAt: Date;

	@UpdateDateColumn({
	    name: 'updated_at',
	  })
	    updatedAt: Date;
}