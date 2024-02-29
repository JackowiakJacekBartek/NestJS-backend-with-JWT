import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserData {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: true })
    fullName: string;
  
    @Column({ nullable: true, type: 'bigint' })
    phoneNumber: number;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    place: string;

    @Column({ nullable: true })
    salary: number;

    @Column({ nullable: true })
    birthDate: Date;
  
    @OneToOne(() => User, user => user.userData)
    user: User;
}