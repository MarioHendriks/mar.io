
import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity("profile")
export class Profile {
  @PrimaryColumn()
  id: number;

  @Column()
  bio: string;

  @Column()
  age: string;

  @Column({nullable: false})
  photo!: string;

  @CreateDateColumn()
  createdDate: Date;
}