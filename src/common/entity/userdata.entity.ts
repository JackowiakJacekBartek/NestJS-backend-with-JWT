import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserData {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: true })
    fullName: string;
  
    @Column({ nullable: true })
    age: number;

    @Column({ nullable: true })
    city: string;
  
    @OneToOne(() => User, user => user.userData)
    user: User;
}