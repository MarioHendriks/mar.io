import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Scribble{
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({default: [], type: "simple-array"})
    trendIDs: string[]

    @Column()
    userID: number;
  
    @Column()
    scribbleText: string;
  
    @CreateDateColumn()
    createdDate: Date;
}