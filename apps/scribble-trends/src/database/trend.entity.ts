
import { IsUUID } from 'class-validator';
import { Entity, Column, CreateDateColumn, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity("trend")
export class Trend {
  @PrimaryGeneratedColumn()
  id: number;


  @Column({unique: true})
  trend: string;

  @Column({default: 0})
  uses: number;

  @CreateDateColumn()
  createdDate: Date;
}