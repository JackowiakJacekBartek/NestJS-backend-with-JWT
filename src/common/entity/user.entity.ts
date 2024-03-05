import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, OneToOne } from 'typeorm';
import { UserData } from './userdata.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  emailVerificationCode: string;

  @Column()
  isConfirmedEmail: boolean;

  @Column()
  accountCreated: Date;

  @OneToOne(() => UserData, userData => userData.user, { cascade: true }) // Definicja relacji One-to-One
  @JoinColumn()
  userData: UserData;
}