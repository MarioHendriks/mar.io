
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import {AccountStatus} from "@mar.io/models" 
import {Roles} from "@mar.io/models" 

@Entity("Auth")
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false, unique: true})
  username!: string;

  @Column({nullable: false, unique: true})
  email!: string;

  @Column({nullable: false})
  password!: string;

  @Column({type: "enum", enum: AccountStatus ,default: AccountStatus.pending })
  accountStatus: AccountStatus;

  @Column({type: "enum", enum: Roles ,default: Roles.member })
  role: Roles;

  @CreateDateColumn()
  createdDate: Date;
}