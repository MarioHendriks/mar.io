
import { IsUUID } from 'class-validator';
import { Entity, Column, CreateDateColumn, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("profile")
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;


  @Column({unique: true})
  userID: number;

  @Column()
  bio: string;

  @Column()
  age: number;

  @Column({nullable: false})
  photo!: string;

  @CreateDateColumn()
  createdDate: Date;
}