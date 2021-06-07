
import { IsUUID } from 'class-validator';
import { Entity, Column, CreateDateColumn, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("like")
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userID: number;

  @Column()
  scribbleID: number;

  @CreateDateColumn()
  createdDate: Date;
}