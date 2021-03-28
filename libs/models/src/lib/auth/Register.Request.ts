import { IsEmail, IsNotEmpty } from "class-validator"


export class RegisterRequest { 
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    passwordVerify: string

    @IsEmail()
    email: string
  
}