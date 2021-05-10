import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Scribble{
    @PrimaryGeneratedColumn()
    id: number;
  
  
    @Column()
    userID: number;
  
    @Column()
    scribbleText: string;
  
    @CreateDateColumn()
    createdDate: Date;
}